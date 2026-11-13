const origin = 'https://evolix-studio.in';
const escapeAttribute = value => value.replace(/&(?!(?:amp|quot|lt|gt|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

function enhanceSEO(html, route) {
  const url = origin + route;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Evolix Studio';
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '';
  let tags = '';
  if (!/rel="canonical"/.test(html)) tags += `<link rel="canonical" href="${url}" />`;
  const image = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1] || `${origin}/assets/og-cover.jpg`;
  const values = { 'og:type': 'website', 'og:site_name': 'Evolix Studio', 'og:title': title, 'og:description': description, 'og:url': url, 'og:image': image, 'og:image:alt': 'Evolix Studio — IT solutions, web development and digital marketing', 'og:locale': 'en_IN', 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': image };
  for (const [name, content] of Object.entries(values)) {
    if (!html.includes(`="${name}"`)) tags += `<meta ${name.startsWith('og:') ? 'property' : 'name'}="${name}" content="${escapeAttribute(content)}" />`;
  }
  // One stable organization identity connects service and article entities.
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Evolix Studio', alternateName: 'Evolix', url: origin + '/', logo: origin + '/assets/evolix-logo.webp', description: 'IT solutions, website development, app development, custom software, branding and digital marketing agency in Indore, India.', email: 'evolixstudio@gmail.com', telephone: '+91-90981-73239', address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressRegion: 'Madhya Pradesh', addressCountry: 'IN' }, sameAs: ['https://www.instagram.com/evolixstudio/', 'https://www.linkedin.com/company/evolixstudio'] },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Evolix Studio', alternateName: 'Evolix', url: origin + '/', publisher: { '@id': `${origin}/#organization` } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title.replace(/&amp;/g, '&'), description: description.replace(/&amp;/g, '&'), isPartOf: { '@id': `${origin}/#website` }, about: { '@id': `${origin}/#organization` }, inLanguage: 'en' }
  ] };
  if (route.split('/').filter(Boolean).length > 1 && !html.includes('"BreadcrumbList"')) {
    const parent = route.split('/')[1];
    schema['@graph'].push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
      { '@type': 'ListItem', position: 2, name: parent[0].toUpperCase() + parent.slice(1), item: origin + '/' + parent },
      { '@type': 'ListItem', position: 3, name: title.split('|')[0].trim().replace(/&amp;/g, '&'), item: url }
    ] });
  }
  tags += `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  return html.replace('</head>', tags + '</head>');
}

function createSitemap(routes) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [...new Set(routes)].sort().map(route => `  <url><loc>${origin}${route}</loc></url>`).join('\n') + '\n</urlset>\n';
}

module.exports = { enhanceSEO, createSitemap };
