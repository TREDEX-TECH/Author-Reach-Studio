import type { Service, Project, Invoice, Task, Book } from './types';

export const DEMO = true;
export const BRAND = {
  name: 'Author Reach Studio',
  parent: 'Tredex',
  relationship: 'Author Reach Studio is a specialist brand of Tredex.',
  email: 'hello@authorreachstudio.com',
  phone: '+234 800 000 0000',
  address: 'Ibadan, Oyo State, Nigeria',
};

export const services: Service[] = [
  { slug:'book-discoverability', name:'Book Discoverability & Metadata', category:'Optimization', icon:'01',
    shortPromise:'Make your book findable by the right readers.',
    description:'A structured review of the metadata, categories and keywords that determine whether the right readers ever encounter your book. We audit what is there, research what should be there, and hand you a precise implementation plan.',
    scope:['Full metadata and category audit','Keyword and reader-intent research','Retailer category recommendations','One structured revision round','Implementation walkthrough call'],
    deliverables:['Metadata audit report','Recommended categories & keywords','Implementation checklist'],
    eligibility:'A published book, or one with a confirmed release date.', duration:'~14 days', pricing:'From $250' },
  { slug:'author-profile-optimization', name:'Author Profile Optimization', category:'Optimization', icon:'02',
    shortPromise:'A credible author presence that converts browsers into followers.',
    description:'Your author profile is often the first thing a reader checks after the cover. We shape a bio, image direction and retailer presence that feels like you and earns trust quickly.',
    scope:['Profile and bio audit','Bio and tagline rewrite','Profile image art direction','Retailer author-page updates','Before/after report'],
    deliverables:['New author bio','Profile image brief','Before/after report'],
    eligibility:'An existing author page, or a new pen name.', duration:'~10 days', pricing:'Custom proposal' },
  { slug:'storefront-improvement', name:'Book Product Page Improvement', category:'Optimization', icon:'03',
    shortPromise:'Stronger product pages across every retailer.',
    description:'Descriptions, bullet copy and editorial content that answer the questions readers actually ask before buying — written for the platform, not copied from the back cover.',
    scope:['Product-page audit','Description rewrite','Retail-ready bullet copy','Formatting and layout guidance','One revision round'],
    deliverables:['Rewritten description','Retail-ready bullet copy','Page checklist'],
    eligibility:'A retailer product page under your control.', duration:'~12 days', pricing:'From $200' },
  { slug:'amazon-a-plus', name:'Amazon A+ Content Support', category:'Optimization', icon:'04',
    shortPromise:'Richer Amazon detail pages — where eligible.',
    description:'Planning, copy and design support for A+ Content modules. We start with an eligibility check so you never pay for something your account cannot publish.',
    scope:['Brand Registry eligibility check','Module and storyboard planning','Module copy deck','Design handoff files','Upload guidance'],
    deliverables:['A+ module plan','Copy deck','Design files'],
    eligibility:'Amazon Brand Registry eligibility is required.', duration:'~21 days', pricing:'Custom proposal' },
  { slug:'promotional-creative', name:'Promotional Graphics & Video', category:'Creative', icon:'05',
    shortPromise:'Scroll-stopping assets built around your book.',
    description:'Campaign graphics, short-form video and ad creative designed to a clear brief, with the source files handed over so your team can keep using them.',
    scope:['Creative brief and references','Two concept directions','Final static asset pack','One short-form video','Two revision rounds'],
    deliverables:['Social graphics pack','One short-form video','Editable source files'],
    eligibility:'Final cover art and brand assets supplied by you.', duration:'~21 days', pricing:'From $350' },
  { slug:'book-launch', name:'Book Launch & Publicity Campaign', category:'Campaigns', icon:'06',
    shortPromise:'A coordinated launch window, not a single post.',
    description:'A six-week launch programme covering planning, asset scheduling, outreach and a post-launch review. We coordinate activity; we never promise a sales outcome we cannot control.',
    scope:['Launch strategy and timeline','Content calendar','Asset schedule','Outreach list and tracker','Weekly check-ins','Post-launch report'],
    deliverables:['Launch plan','Content calendar','Outreach tracker','Post-launch report'],
    eligibility:'A launch date at least six weeks away.', duration:'~6 weeks', pricing:'Custom proposal' },
  { slug:'reader-engagement', name:'Reader Engagement Campaigns', category:'Campaigns', icon:'07',
    shortPromise:'Ethical reader outreach, within platform rules.',
    description:'Goodreads and reader-community engagement designed around what each platform actually permits. Compliance comes first; activity is logged and reported transparently.',
    scope:['Platform rule and compliance check','Outreach plan','Approved activity log','Engagement report'],
    deliverables:['Compliance check','Activity log','Engagement report'],
    eligibility:'Platform rules must permit the proposed activity.', duration:'~28 days', pricing:'Custom proposal' },
  { slug:'author-website', name:'Author Website & Brand Development', category:'Web', icon:'08',
    shortPromise:'A home base on the internet that you own.',
    description:'A fast, accessible author website with clear paths from reader interest to mailing list, book page and purchase — built to be handed over, not held hostage.',
    scope:['Discovery and sitemap','Design in your brand system','Responsive build','Basic on-page SEO','Content migration','Handover session'],
    deliverables:['Responsive website','Basic SEO setup','Handover guide'],
    eligibility:'A domain and hosting account under your control.', duration:'~35 days', pricing:'Custom proposal' },
];

export const projects: Project[] = [
  { id:'ARS-PRJ-0142', name:'Launch programme — The Salt Road', book:'The Salt Road', status:'Active', tone:'ok',
    progress:68, manager:'Tola Adebayo', due:'18 Nov 2026',
    milestones:[{label:'Discovery & brief',done:true},{label:'Metadata and page audit',done:true},{label:'Creative asset production',done:true},{label:'Launch campaign execution',done:false},{label:'Post-launch report',done:false}] },
  { id:'ARS-PRJ-0138', name:'Author platform refresh', book:'Author brand', status:'In review', tone:'warn',
    progress:91, manager:'Tola Adebayo', due:'02 Nov 2026',
    milestones:[{label:'Brand discovery',done:true},{label:'Website design',done:true},{label:'Build and content migration',done:true},{label:'Client review',done:false}] },
  { id:'ARS-PRJ-0121', name:'Metadata optimisation — Ash & Ink', book:'Ash & Ink', status:'Completed', tone:'neutral',
    progress:100, manager:'Chidi Okafor', due:'22 Sep 2026',
    milestones:[{label:'Audit',done:true},{label:'Research',done:true},{label:'Implementation',done:true},{label:'Handover',done:true}] },
];

export const invoices: Invoice[] = [
  { id:'inv-1', number:'ARS-2026-0041', date:'12 Oct 2026', due:'26 Oct 2026', amount:1450, status:'Outstanding', tone:'warn', description:'Launch programme — phase 1' },
  { id:'inv-2', number:'ARS-2026-0038', date:'02 Sep 2026', due:'16 Sep 2026', amount:850, status:'Paid', tone:'ok', description:'Book discoverability & metadata' },
  { id:'inv-3', number:'ARS-2026-0031', date:'14 Aug 2026', due:'28 Aug 2026', amount:700, status:'Paid', tone:'ok', description:'Product page improvement' },
  { id:'inv-4', number:'ARS-2026-0024', date:'30 Jun 2026', due:'14 Jul 2026', amount:1200, status:'Refunded', tone:'neutral', description:'Promotional creative (cancelled scope)' },
];

export const tasks: Task[] = [
  { id:'T-441', title:'Finalise A+ module copy deck', project:'The Salt Road launch', due:'27 Oct 2026', status:'In review', tone:'warn', priority:'High' },
  { id:'T-437', title:'Export social graphics pack (v3)', project:'The Salt Road launch', due:'28 Oct 2026', status:'In progress', tone:'info', priority:'High' },
  { id:'T-430', title:'Keyword research — category set B', project:'Ash & Ink metadata', due:'30 Oct 2026', status:'To do', tone:'neutral', priority:'Medium' },
  { id:'T-428', title:'Client feedback on homepage proof', project:'Author platform refresh', due:'25 Oct 2026', status:'Changes requested', tone:'danger', priority:'Urgent' },
  { id:'T-419', title:'Upload launch calendar to project files', project:'The Salt Road launch', due:'24 Oct 2026', status:'Approved', tone:'ok', priority:'Low' },
];

export const books: Book[] = [
  { id:'b-1', title:'The Salt Road', subtitle:'A novel of the northern trade routes', genre:'Literary fiction', isbn:'978-1-00000-000-1', status:'Published · 2026' },
  { id:'b-2', title:'Ash & Ink', subtitle:'', genre:'Historical fantasy', isbn:'Not yet assigned', status:'Pre-publication' },
  { id:'b-3', title:'Notes to a Young Writer', subtitle:'', genre:'Non-fiction / Writing', isbn:'978-1-00000-000-3', status:'Published · 2023' },
];

export const proposals = [
  { id:'PROP-2026-0088', title:'Launch programme — The Salt Road', version:'v2', amount:2900, status:'Accepted', tone:'ok', date:'04 Oct 2026', valid:'03 Nov 2026' },
  { id:'PROP-2026-0091', title:'Author website phase 2', version:'v1', amount:1800, status:'Awaiting decision', tone:'warn', date:'20 Oct 2026', valid:'19 Nov 2026' },
  { id:'PROP-2026-0079', title:'Reader engagement pilot', version:'v1', amount:950, status:'Declined', tone:'neutral', date:'11 Sep 2026', valid:'11 Oct 2026' },
];

export const inquiries = [
  { id:'INQ-2026-0311', name:'Amara Nwosu', interest:'Book launch', stage:'Qualified', source:'Service page', date:'24 Oct 2026', owner:'Tola A.' },
  { id:'INQ-2026-0310', name:'Daniel Adeyemi', interest:'Metadata', stage:'New inquiry', source:'Contact form', date:'24 Oct 2026', owner:'Unassigned' },
  { id:'INQ-2026-0309', name:'Grace Eze', interest:'A+ Content', stage:'Proposal sent', source:'Homepage CTA', date:'23 Oct 2026', owner:'Chidi O.' },
  { id:'INQ-2026-0308', name:'Femi Balogun', interest:'Author website', stage:'Contacted', source:'Referral', date:'22 Oct 2026', owner:'Tola A.' },
  { id:'INQ-2026-0307', name:'Ngozi Umeh', interest:'Promotional creative', stage:'Active client', source:'Instagram', date:'20 Oct 2026', owner:'Tola A.' },
];

export const team = [
  { name:'Tola Adebayo', role:'Project Manager', dept:'Project Management', status:'Active', initials:'TA' },
  { name:'Chidi Okafor', role:'Discoverability Lead', dept:'Research & Discoverability', status:'Active', initials:'CO' },
  { name:'Aisha Bello', role:'Creative Designer', dept:'Creative Design & Video', status:'Active', initials:'AB' },
  { name:'Emeka Obi', role:'Finance Officer', dept:'Finance & Administration', status:'Active', initials:'EO' },
  { name:'Bimpe Adeyemi', role:'Client Success', dept:'Client Relations', status:'On leave', initials:'BA' },
];

export const money = (n: number, currency = 'USD') =>
  currency === 'USD' ? `$${n.toLocaleString('en-US')}` : `${currency} ${n.toLocaleString()}`;
