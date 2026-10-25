export const publicNav = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/work', label: 'Our work' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export const footerNav = [
  { title: 'Services', links: [
    { href:'/services/book-discoverability', label:'Book discoverability' },
    { href:'/services/promotional-creative', label:'Promotional creative' },
    { href:'/services/book-launch', label:'Launch campaigns' },
    { href:'/services', label:'View all services' },
  ]},
  { title: 'Company', links: [
    { href:'/about', label:'About us' },
    { href:'/how-it-works', label:'How it works' },
    { href:'/work', label:'Our work' },
    { href:'/contact', label:'Contact' },
  ]},
  { title: 'Legal', links: [
    { href:'/legal/privacy', label:'Privacy policy' },
    { href:'/legal/terms', label:'Terms of service' },
    { href:'/legal/refunds', label:'Refund & payment policy' },
    { href:'/faq', label:'FAQ' },
  ]},
];

export type NavItem = { href: string; label: string; icon: string };
export type NavGroup = { group: string; items: NavItem[] };

const I = {
  grid:'◧', book:'▤', file:'▦', cash:'◈', msg:'◇', gear:'◎', folder:'▧',
  check:'✓', chart:'▥', users:'◍', layers:'▣', bell:'◉', shield:'◐', inbox:'▨',
};

export const portalNav: NavGroup[] = [
  { group:'Overview', items:[{href:'/portal',label:'Dashboard',icon:I.grid}] },
  { group:'My work', items:[
    {href:'/portal/projects',label:'Projects',icon:I.layers},
    {href:'/portal/proposals',label:'Proposals',icon:I.file},
    {href:'/portal/books',label:'My books',icon:I.book},
    {href:'/portal/files',label:'Files & deliverables',icon:I.folder},
  ]},
  { group:'Insights', items:[
    {href:'/portal/results',label:'Campaign results',icon:I.chart},
    {href:'/portal/reports',label:'Reports',icon:I.file},
    {href:'/portal/notifications',label:'Notifications',icon:I.bell},
  ]},
  { group:'Account', items:[
    {href:'/portal/invoices',label:'Invoices & payments',icon:I.cash},
    {href:'/portal/messages',label:'Messages',icon:I.msg},
    {href:'/portal/settings',label:'Settings',icon:I.gear},
  ]},
];

export const workspaceNav: NavGroup[] = [
  { group:'Overview', items:[{href:'/workspace',label:'My dashboard',icon:I.grid}] },
  { group:'Delivery', items:[
    {href:'/workspace/tasks',label:'My tasks',icon:I.check},
    {href:'/workspace/projects',label:'Projects',icon:I.layers},
    {href:'/workspace/reviews',label:'Reviews',icon:I.inbox},
    {href:'/workspace/files',label:'Files',icon:I.folder},
  ]},
  { group:'Team', items:[
    {href:'/workspace/department',label:'My department',icon:I.users},
    {href:'/workspace/messages',label:'Conversations',icon:I.msg},
  ]},
];

export const adminNav: NavGroup[] = [
  { group:'Overview', items:[
    {href:'/admin',label:'Dashboard',icon:I.grid},
    {href:'/admin/reports',label:'Reports',icon:I.chart},
  ]},
  { group:'Operations', items:[
    {href:'/admin/crm',label:'Inquiries & CRM',icon:I.inbox},
    {href:'/admin/clients',label:'Clients & authors',icon:I.users},
    {href:'/admin/projects',label:'Projects',icon:I.layers},
    {href:'/admin/services',label:'Service catalogue',icon:I.book},
  ]},
  { group:'Business', items:[
    {href:'/admin/finance',label:'Finance',icon:I.cash},
    {href:'/admin/team',label:'Team & departments',icon:I.users},
    {href:'/admin/content',label:'Website content',icon:I.file},
  ]},
  { group:'System', items:[
    {href:'/admin/audit',label:'Audit log',icon:I.shield},
    {href:'/admin/settings',label:'Settings & roles',icon:I.gear},
  ]},
];
