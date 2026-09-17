import { whatsappMessage } from './translations.mjs';
export const QUESTIONS = [
  { area: 'Brand clarity', title: 'First impressions matter.', question: 'If a new customer sees your business for 10 seconds, will they understand what you do and why they should choose you?', answers: ['Yes, our positioning is extremely clear', 'Mostly clear, but we could communicate it better', 'We mainly explain our products/services', 'Not really / we have never thought about this'], weight: 10, points: [10, 7, 4, 0], hint: 'Think about a customer discovering you for the first time.' },
  { area: 'Online presence', title: 'Be worth discovering.', question: 'When someone searches for your business online, what do they find?', answers: ['Professional website + active social presence + correct business information', 'Website and social media, but some parts are outdated', 'Mainly Instagram/social media or Google listing', 'Very little / nothing professional'], weight: 15, points: [15, 10, 5, 0], hint: 'Your digital presence often makes the first introduction.' },
  { area: 'Lead generation', title: 'Make opportunity repeatable.', question: 'Where do most of your new enquiries currently come from?', answers: ['Multiple predictable channels', 'One strong channel consistently', 'Mostly referrals / occasional social media enquiries', "We don't have a predictable source of leads"], weight: 15, points: [15, 10, 5, 0], hint: 'Think about where your last few customers found you.' },
  { area: 'Sales process', title: 'Give every enquiry a next step.', question: 'Do you have a defined process from enquiry → follow-up → quotation → payment?', answers: ['Yes, it is clear and consistently followed', 'Mostly, but some steps are manual or inconsistent', 'It depends on the person handling it', 'No defined process'], weight: 15, points: [15, 10, 5, 0], hint: 'Consider what happens after someone says, “I’m interested.”' },
  { area: 'Customer information', title: 'Bring the pieces together.', question: 'Where is your customer and sales information stored?', answers: ['One organised system / CRM / ERP', 'Mostly organised spreadsheets or software', 'WhatsApp + spreadsheets + notebooks across different places', 'There is no proper system'], weight: 15, points: [15, 10, 5, 0], hint: 'Could your team find a customer’s history in one place?' },
  { area: 'Operations', title: 'Make room for better work.', question: 'How much repetitive work does your team still do manually?', answers: ['Very little; most repetitive work is systemised', 'Some manual work remains', 'A lot of everyday work is manual', 'Almost everything depends on people doing it manually'], weight: 15, points: [15, 10, 5, 0], hint: 'Think about the tasks your team repeats every single day.' },
  { area: 'Scalability', title: 'Get ready for what’s next.', question: 'If your business suddenly doubled in customers next month, could your current systems handle the growth smoothly?', answers: ['Yes, we could handle it comfortably', 'Mostly, but we would need some adjustments', 'We would probably struggle in several areas', 'No, our current process would become difficult to manage'], weight: 15, points: [15, 10, 5, 0], hint: 'One last question. Picture your business at twice its current size.' },
];
export const INDUSTRIES = ['Retail', 'Trading', 'Manufacturing', 'Construction', 'Real Estate', 'Healthcare', 'Education', 'Food & Beverage', 'Beauty & Wellness', 'Professional Services', 'E-commerce', 'Automotive', 'Hospitality', 'Export/Import', 'Other'];
export const PRIORITY = [2, 3, 5, 4, 6, 1, 0];
export const LEVELS = [100, 67, 33, 0];
export const RECOMMENDATIONS = [
  { title: 'Make your value clear in seconds', copy: 'Clarify what you do, who you help and why a customer should choose you. Use the same positioning across your website, social profiles and sales material.', help: 'EVOLIX can connect your positioning, visual identity and brand touchpoints.', project: 'nut' },
  { title: 'Strengthen what customers find', copy: 'Make sure your website, Google presence and social profiles are current, trustworthy and consistent. Every touchpoint should make the next action obvious.', help: 'EVOLIX can build a website that presents your business clearly and turns interest into enquiries.', project: 'website' },
  { title: 'Build a more predictable enquiry engine', copy: 'Reduce dependence on occasional enquiries or referrals alone. Develop a repeatable channel that brings the right prospects into your business.', help: 'EVOLIX can connect your content, campaigns and enquiry journey.', project: 'marketing' },
  { title: 'Turn enquiries into a defined sales flow', copy: 'Create a clear process from enquiry to follow-up, quotation and payment so opportunities are easier to track and act on.', help: 'EVOLIX can build a CRM around your sales process, with follow-ups and pipeline visibility.', project: 'crm' },
  { title: 'Create one reliable source of customer information', copy: 'Bring customer, sales and follow-up information into a structured system so your team can move beyond scattered chats, notebooks and files.', help: 'EVOLIX can bring your customer information together in a custom CRM.', project: 'crm' },
  { title: 'Remove repetitive work from daily operations', copy: 'Identify the tasks your team repeats most often and systemise the highest-impact ones first. Aim for fewer manual steps and more visibility.', help: 'EVOLIX can connect quotations, delivery orders and daily workflows in custom software.', project: 'erp' },
  { title: 'Prepare your systems before growth creates pressure', copy: 'Identify the processes that would struggle if demand doubled. Strengthen those areas before adding customers, staff or locations.', help: 'EVOLIX can connect orders, delivery and finance in a system built around your business.', project: 'kitchen' },
];
export const ADVANCED = [
  { area: 'Conversion intelligence', title: 'Improve conversion intelligence', copy: 'Your answers indicate a strong foundation. Explore where customers hesitate and use better reporting to guide your next improvements.', help: 'EVOLIX can help connect your customer journey with useful sales insights.', project: 'crm' },
  { area: 'Connected reporting', title: 'Connect systems and reporting', copy: 'Look for opportunities to bring your already organised processes into a clearer business-wide view.', help: 'EVOLIX can connect your operational workflows and reporting.', project: 'erp' },
  { area: 'Advanced automation', title: 'Explore advanced automation and scale', copy: 'Review the exceptions that still require manual attention and plan systems for the next stage of growth.', help: 'EVOLIX can develop custom workflows around the way your business grows.', project: 'kitchen' },
];
const BASE = 'https://evolix-studio.in';
export const PROJECTS = {
  nut: { name: 'Nut Delicacy', type: 'Brand identity · E-commerce', image: BASE + '/assets/case-studies/nut-delicacy/assets/nut-delicacy-experience.webp', url: BASE + '/work/nut-delicacy' },
  website: { name: 'Elytek Technologies', type: 'Website · 3D experience', image: BASE + '/assets/case-studies/elytek-technologies/gallery/01-elytek-3d-display-surface-homepage.webp', url: BASE + '/work/elytek-technologies', live: 'https://elytek.in/' },
  marketing: { name: 'Tasawuk', type: 'Social media · Paid advertising', image: BASE + '/assets/case-studies/tasawuk/assets/tasawuk-insights-overview.webp', url: BASE + '/work/tasawuk' },
  crm: { name: 'Evolix CRM', type: 'Custom software · Sales pipeline', image: BASE + '/assets/work/software/crm/01.webp', url: 'https://evolixcrm.netlify.app/' },
  erp: { name: 'Shieldmax Safety', type: 'Custom ERP · Business operations', image: BASE + '/assets/work/software/shield-max/01.webp', url: BASE + '/work/shieldmax-safety', live: 'https://sheild-max.netlify.app/' },
  kitchen: { name: 'Mom’s Kitchen', type: 'Custom CRM · Orders & finance', image: BASE + '/assets/case-studies/moms-kitchen/assets/moms-kitchen-dashboard.webp', url: BASE + '/work/moms-kitchen' },
  retail: { name: 'Indian Remedies', type: 'Website · E-commerce', image: BASE + '/assets/work/website/indian-remedies/01.webp', url: 'https://indianremedies.netlify.app/' },
  trading: { name: 'Nagarwala Trading LLC', type: 'Website · Product catalogue', image: BASE + '/assets/work/website/nagarwala/01.webp', url: BASE + '/work/nagarwala-trading-llc', live: 'https://nagarwala-trading.netlify.app/' },
};
export function scoreBand(score) {
  if (score <= 30) return { label: 'Foundation needed', headline: 'A stronger foundation starts here.', copy: 'There are opportunities to strengthen how your business is presented, discovered and managed. Start with the fundamentals.' };
  if (score <= 50) return { label: 'Developing', headline: 'Connect the pieces. Unlock the potential.', copy: 'You have pieces working. Connecting the important parts could reduce manual work and create a more consistent customer experience.' };
  if (score <= 70) return { label: 'Growth ready', headline: 'A good foundation. A bigger future.', copy: 'Your business has several strong foundations. Improving a few areas could make growth more predictable and easier to manage.' };
  return { label: 'Digitally strong', headline: 'Strong foundations. New possibilities.', copy: 'Your answers indicate a solid digital and operational base. Your next opportunity is to connect systems, reduce friction and prepare for scale.' };
}
export function calculateAudit(answers) {
  if (!Array.isArray(answers) || answers.length !== 7 || answers.some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Please answer all seven questions.');
  const rawScore = answers.reduce((sum, answer, i) => sum + QUESTIONS[i].points[answer], 0);
  const score = Math.min(85, rawScore);
  const strengths = answers.map(a => LEVELS[a]);
  const order = QUESTIONS.map((_, i) => i).sort((a, b) => strengths[a] - strengths[b] || PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
  const strongest = strengths.indexOf(Math.max(...strengths));
  const allStrong = answers.every(a => a === 0);
  const recommendations = allStrong ? ADVANCED : order.slice(0, 3).map(i => ({ ...RECOMMENDATIONS[i], area: QUESTIONS[i].area, questionIndex: i, ...(answers[i] === 0 ? { title: `Build on your ${QUESTIONS[i].area.toLowerCase()}`, copy: 'Your answer suggests this area is working well. Review its performance and look for small improvements that support your next stage of growth.' } : {}) }));
  return { score, rawScore, band: scoreBand(score), strengths, strongest, opportunities: order.slice(0, 3), recommendations, allStrong };
}
export function validateLead(input = {}) {
  const errors = {};
  const lead = { name: String(input.name || '').trim(), business: String(input.business || '').trim(), phone: String(input.phone || '').replace(/[\s()-]/g, ''), industry: String(input.industry || ''), website: String(input.website || '').trim(), consent: input.consent === true };
  if (lead.name.length < 2 || lead.name.length > 80) errors.name = 'Enter your name (2–80 characters).';
  if (lead.business.length < 2 || lead.business.length > 120) errors.business = 'Enter your business name (2–120 characters).';
  if (!/^\+[1-9]\d{7,14}$/.test(lead.phone) || (lead.phone.startsWith('+91') && !/^\+91[6-9]\d{9}$/.test(lead.phone))) errors.phone = 'Enter a valid number with country code, such as +91 98765 43210.';
  if (!INDUSTRIES.includes(lead.industry)) errors.industry = 'Choose your industry.';
  if (lead.website.length > 250 || /[<>\x00-\x1f]/.test(lead.website)) errors.website = 'Enter a website or Instagram handle under 250 characters.';
  if (!lead.consent) errors.consent = 'Please confirm the checkbox to continue.';
  return { lead, errors, valid: Object.keys(errors).length === 0 };
}
export function whatsappUrl(result, lead, language = 'en') {
  const next = result.allStrong ? 'advanced optimisation' : QUESTIONS[result.opportunities[0]].area;
  const text = whatsappMessage(language, { ...lead, score: result.score, next }) || `Hi EVOLIX, I completed the Business Evolution Audit for ${lead.business} and received an EVOLIX Score of ${result.score}/100 (audit maximum: 85). My ${result.allStrong ? 'next focus' : 'biggest opportunity'} is ${next}. I would like to start my journey with EVOLIX and discuss my Evolution Roadmap.\n\nName: ${lead.name}\nIndustry: ${lead.industry}`;
  return `https://wa.me/919098173239?text=${encodeURIComponent(text)}`;
}
