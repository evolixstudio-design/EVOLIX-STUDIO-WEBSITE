// Read-only smoke check of the built site: pages, metadata and local resources.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const origin = 'https://evolix-studio.in';
const local = process.env.SITE_URL || 'http://localhost:3000';
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1].replace(origin, ''));

async function main() {
  assert(routes.length > 20, 'Sitemap should include service, work and blog pages');
  const titles = new Set();
  const errors = [];
  const resources = new Set();
  for (const route of routes) {
    const response = await fetch(local + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert(!/\{\{(?:partial|vite|page):/.test(html), `Unresolved template: ${route}`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert(title && !titles.has(title), `Missing or duplicate title: ${route}`);
    titles.add(title);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `Canonical count: ${route}`);
    assert(html.includes(`rel="canonical" href="${origin}${route}"`), `Canonical target: ${route}`);
    assert(/<meta name="description" content="[^"\s]/.test(html), `Description: ${route}`);
    // The event application renders its content with React.
    if (route !== '/event') assert.equal((html.match(/<h1\b/gi) || []).length, 1, `Heading count: ${route}`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (!/\bsrc=|type="(?:application\/ld\+json|module)"/.test(match[1])) new vm.Script(match[2], { filename: route });
    }
    assert(html.includes(`${origin}/#organization`), `Business identity: ${route}`);
    for (const tag of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)) {
      for (const match of tag[0].matchAll(/\b(?:src|href)="(\/[^"?#]*)[^"\s]*"/g)) resources.add(match[1]);
      for (const match of tag[0].matchAll(/\bsrcset="([^"]+)"/g)) {
        for (const candidate of match[1].split(',')) resources.add(candidate.trim().split(/\s+/)[0]);
      }
    }
  }
  for (const resource of resources) {
    if (!resource.startsWith('/') || resource.startsWith('//')) continue;
    const file = path.join(root, decodeURIComponent(resource));
    if (!fs.existsSync(file) && !fs.existsSync(file + '.html') && !fs.existsSync(path.join(file, 'index.html'))) errors.push(resource);
  }
  assert.deepEqual(errors, [], 'Broken internal links or resources');
  const home = await (await fetch(local + '/')).text();
  const testimonials = home.match(/id="testimonials"[\s\S]*?<\/section>/)?.[0];
  assert.equal((testimonials.match(/class="ts-slide(?: active)? ts-slide-compact"/g) || []).length, 10);
  assert.equal((testimonials.match(/class="ts-dot(?: active)?"/g) || []).length, 10);
  assert.equal((testimonials.match(/data-review-status="existing"/g) || []).length, 6);
  assert.equal((testimonials.match(/data-review-status="draft"/g) || []).length, 4);
  assert.equal((testimonials.match(/Draft review copy · awaiting client approval/g) || []).length, 4);
  assert(!testimonials.includes('Proposed testimonial'), 'Redundant testimonial badge removed');
  assert(/id="testimonialTrack"/.test(testimonials), 'Horizontal testimonial track exists');
  assert(/id="tsPrevBtn"/.test(testimonials) && /id="tsNextBtn"/.test(testimonials), 'Both testimonial arrows exist');
  assert(!/Jumana Maimoon|Aliasg[ae]r Maimoon|Nut Delicacy|Elytek Technologies|Priya Jaiswal/i.test(testimonials));
  assert(!/hero-services-list|agencyOverview|approachGrid|Enterprise Delivery|>Featured Work</.test(home), 'Selected homepage blocks removed');
  assert(home.includes('Serving clients globally.'), 'Homepage states global coverage');
  assert(/stats-banner-value">16<\//.test(home) && /stats-banner-value">12\+<\//.test(home), 'Homepage team and project figures');
  assert(/class="launch-card" href="\/contact"/.test(home), 'Rocket launch links to Contact');
  const ai = home.match(/class="footer-ai-providers"[\s\S]*?<\/div>/)?.[0];
  assert.equal((ai.match(/<a\b/g) || []).length, 6, 'Six AI assistants in the footer');
  assert(home.includes('srcset='), 'Responsive images should be present');
  assert(/\/css\/home\.min\.css\?v=[a-f0-9]{12}/.test(home), 'Updated CSS should bypass older browser caches');
  assert(/\/js\/hero\.min\.js\?v=[a-f0-9]{12}/.test(home), 'Updated scripts should bypass older browser caches');
  assert(!home.includes('fonts.googleapis.com'), 'Main site should use local fonts');
  for (const slug of ['it-solutions-indore','app-development-indore','software-development-indore','digital-marketing-indore']) {
    assert(routes.includes('/services/' + slug));
    assert(home.includes(`href="/services/${slug}"`));
  }
  assert(fs.statSync(path.join(root, 'favicon.ico')).size < 10000, 'Favicon size');
  const portfolio = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio-additions.json'), 'utf8'));
  for (const project of portfolio.projects) {
    assert(routes.includes('/work/' + project.slug), `Project sitemap entry: ${project.slug}`);
    assert(home.includes(`data-project-slug="${project.slug}"`), `Homepage project: ${project.slug}`);
    const page = await (await fetch(local + '/work/' + project.slug)).text();
    assert(page.includes(project.url), `Original project link: ${project.slug}`);
    assert(page.includes(project.owner), `Owner credit: ${project.slug}`);
    const screenshots = project.slug === 'rashidi-star'
      ? ['dashboard-redacted', 'sales-invoices-redacted']
      : ['desktop', 'mobile'];
    for (const screenshot of screenshots) {
      assert(page.includes(`/assets/case-studies/${project.slug}/${screenshot}.webp`), `Screenshot shown: ${project.slug}/${screenshot}`);
      assert(fs.statSync(path.join(root, 'assets/case-studies', project.slug, screenshot + '.webp')).size > 1000, `Screenshot file: ${project.slug}/${screenshot}`);
    }
  }
  console.log(`PASS: ${routes.length} pages, ${resources.size} internal targets, six new projects with real screenshots, six existing testimonials and four labelled review drafts.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
