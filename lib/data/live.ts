// Server-side view of the live Supabase database.
//
// Every dashboard screen reads from here. Requests use the signed-in user's JWT
// when available, otherwise the publishable key — RLS applies in both cases, so
// anonymous visitors see no private records and a signed-in user sees exactly what
// their role permits. Empty or unreachable tables return an empty array — never
// invented records.
import { cache } from 'react';
import type { Service } from '@/lib/types';
import { hasSupabase } from '@/lib/config';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { getCatalogue } from './catalogue';
import { dateLabel, initials, titleCase, toneForStatus } from '@/lib/format';

// ---------------------------------------------------------------------------
// Raw row shapes (only the columns we render)
// ---------------------------------------------------------------------------
type ProjectRow = { id:string; reference?:string|null; name:string; status:string|null;
  book_id:string|null; project_manager_id:string|null; target_date:string|null; start_date:string|null };
type MilestoneRow = { id:string; project_id:string; title:string; completed_at:string|null; sort_order:number };
type BookRow = { id:string; title:string; subtitle:string|null; genre:string|null; isbn_13:string|null;
  publication_status:string|null; target_audience:string|null; author_id:string|null };
type InvoiceRow = { id:string; invoice_number:string; status:string; currency:string;
  total_amount:number|string; amount_paid:number|string; subtotal:number|string; tax_amount:number|string;
  issued_at:string|null; due_date:string|null; notes:string|null; project_id:string|null; author_id:string|null;
  legal_entity_snapshot:unknown };
type InvoiceItemRow = { id:string; invoice_id:string; description:string; quantity:number;
  unit_price:number|string; line_total:number|string; sort_order:number };
type PaymentRow = { id:string; invoice_id:string; provider_reference:string|null; amount:number|string;
  currency:string; status:string; verified_at:string|null; created_at:string|null };
type TaskRow = { id:string; project_id:string; title:string; status:string; priority:string;
  due_date:string|null; requires_review:boolean };
type ProposalRow = { id:string; reference:string|null; title:string; status:string;
  total_amount:number|string|null; currency:string; valid_until:string|null; created_at:string|null };
type ProposalVersionRow = { id:string; proposal_id:string; version_number:number; total_amount:number|string|null };
type InquiryRow = { id:string; reference:string; full_name:string; email:string;
  service_interest:string|null; status:string; source:string|null; created_at:string|null;
  assigned_to:string|null; spam_score:number|string|null };
type ProfileRow = { id:string; full_name:string; display_name:string|null; email:string; status:string };
type AuthorRow = { id:string; display_name:string; primary_email:string|null; crm_stage:string|null;
  status:string; relationship_manager_id:string|null; created_at:string|null };
type DeptRow = { id:string; name:string; head_user_id:string|null; is_active:boolean };
type MembershipRow = { department_id:string; user_id:string };
type UserRoleRow = { user_id:string; role_id:string };
type StageRow = { id:string; slug:string; label:string; sort_order:number; is_active:boolean };
type PackageRow = { id:string; name:string };
type PermissionRow = { id:string; slug:string; description:string|null };
type AuditRow = { id:string; action:string; entity_type:string; entity_id:string|null;
  actor_id:string|null; metadata:unknown; created_at:string|null };
type SettingRow = { key:string; value:unknown; description:string|null; is_public:boolean };
type RoleRow = { id:string; slug:string; name:string; description:string|null };
type ConversationRow = { id:string; subject:string|null; project_id:string|null; kind:string; created_at:string|null };
type MessageRow = { id:string; conversation_id:string; sender_user_id:string|null; body:string;
  visibility:string; created_at:string|null };
type FileRow = { id:string; original_name:string; mime_type:string; size_bytes:number;
  bucket:string; storage_path:string; visibility:string; project_id:string|null; created_at:string|null };
type DeliverableRow = { id:string; project_id:string; title:string; status:string;
  visibility:string; created_at:string|null };
type DeliverableVersionRow = { id:string; deliverable_id:string; version_number:number; created_at:string|null };
type CampaignRow = { id:string; name:string; status:string; planned_start:string|null; planned_end:string|null;
  project_id:string|null };
type MetricRow = { id:string; campaign_id:string; metric_name:string; metric_value:number|string;
  unit:string|null; source:string; source_name:string|null; period_start:string|null; period_end:string|null };
type NotificationRow = { id:string; title:string; body:string|null; link_url:string|null;
  status:string; channel:string; created_at:string|null; read_at:string|null };

// ---------------------------------------------------------------------------
// View models — deliberately shaped like the screens that consume them.
// ---------------------------------------------------------------------------
export type ProjectVM = { id:string; ref:string; name:string; book:string; status:string; tone:string;
  progress:number; manager:string; due:string; milestones:{label:string;done:boolean}[] };
export type InvoiceVM = { id:string; number:string; date:string; due:string; amount:number;
  currency:string; paid:number; status:string; tone:string; description:string;
  subtotal:number; tax:number; notes:string; projectId:string|null; legalEntity:unknown;
  billTo:string; billToEmail:string;
  items:{description:string;quantity:number;unit:number;total:number}[] };
export type BookVM = { id:string; title:string; subtitle:string; genre:string; isbn:string;
  status:string; audience:string };
export type TaskVM = { id:string; title:string; project:string; due:string; status:string;
  tone:string; priority:string; requiresReview:boolean };
export type ProposalVM = { id:string; title:string; version:string; amount:number; currency:string;
  status:string; tone:string; date:string; valid:string };
export type InquiryVM = { id:string; name:string; email:string; interest:string; stage:string;
  tone:string; source:string; date:string; owner:string };
export type TeamVM = { name:string; role:string; dept:string; status:string; initials:string; email:string };
export type AuditVM = { when:string; action:string; entity:string; actor:string; detail:string; tone:string };
export type AuthorVM = { id:string; name:string; email:string; books:number; projects:number;
  stage:string; status:string; tone:string; manager:string; created:string };
export type ResultVM = { id:string; metric:string; value:string; campaign:string; period:string; source:string };
export type ReportVM = { id:string; title:string; date:string; project:string; status:string; tone:string; version:string };
export type MessageVM = { id:string; conversation:string; sender:string; body:string;
  visibility:string; when:string };
export type FileVM = { id:string; name:string; size:string; date:string; status:string;
  tone:string; project:string; visibility:string; ext:string };
export type DeliverableVM = { id:string; title:string; project:string; status:string;
  tone:string; version:string; date:string; visibility:string };
export type PaymentVM = { id:string; reference:string; amount:number; currency:string;
  status:string; date:string; invoiceId:string; verified:boolean };

export type Snapshot = {
  ok: boolean;
  services: Service[];
  projects: ProjectVM[];
  invoices: InvoiceVM[];
  books: BookVM[];
  tasks: TaskVM[];
  proposals: ProposalVM[];
  inquiries: InquiryVM[];
  team: TeamVM[];
  authors: AuthorVM[];
  departments: { id:string; name:string; head:string; members:number; active:boolean }[];
  audit: AuditVM[];
  settings: SettingRow[];
  roles: RoleRow[];
  conversations: { id:string; subject:string; project:string; kind:string; messages:number }[];
  messages: MessageVM[];
  files: FileVM[];
  deliverables: DeliverableVM[];
  payments: PaymentVM[];
  campaigns: { id:string; name:string; status:string; start:string; end:string }[];
  metrics: MetricRow[];
  results: ResultVM[];
  reports: ReportVM[];
  notifications: NotificationRow[];
  stages: StageRow[];
  packages: PackageRow[];
  permissions: PermissionRow[];
  counts: {
    projects:number; activeProjects:number; invoices:number; outstanding:number;
    books:number; tasks:number; proposals:number; inquiries:number; team:number;
    departments:number; files:number; deliverables:number; payments:number;
    verifiedRevenue:number; roles:number; settings:number; campaigns:number; audit:number;
    authors:number; results:number; reports:number; packages:number; permissions:number;
  };
};

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Use the signed-in user's JWT when there is a session. Anonymous visitors keep
// the publishable key — RLS then returns no private rows. A service-role key is
// NEVER used here.
async function requestHeaders(): Promise<Record<string, string>> {
  if (!hasSupabase() || !URL || !KEY) return {};
  const fallback = { apikey: KEY, Authorization: `Bearer ${KEY}` };
  try {
    const sb = await createServerSupabaseClient();
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token
      ? { apikey: KEY, Authorization: `Bearer ${session.access_token}` }
      : fallback;
  } catch { return fallback; }
}

async function table<T>(headers: Record<string, string>, name: string, query = 'select=*'): Promise<T[]> {
  if (!hasSupabase() || !URL || !KEY) return [];
  try {
    const res = await fetch(`${URL}/rest/v1/${name}?${query}`, {
      headers,
      // Private data must never enter Next's shared Data Cache.
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const d: unknown = await res.json();
    return Array.isArray(d) ? (d as T[]) : [];
  } catch { return []; }
}

const num = (v: unknown) => Number(v ?? 0) || 0;
const byId = <T extends { id:string }>(rows: T[]) => new Map(rows.map(r => [r.id, r]));
const readableSize = (b: number) => b >= 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${Math.max(1,Math.round(b/1024))} KB`;

async function build(): Promise<Snapshot> {
  const headers = await requestHeaders();
  const t = <T>(name: string, query?: string) => table<T>(headers, name, query);
  const [catalogue, projectRows, milestoneRows, bookRows, invoiceRows, itemRows, paymentRows,
    taskRows, proposalRows, versionRows, inquiryRows, profileRows, authorRows, deptRows,
    membershipRows, userRoleRows, auditRows, settingRows, roleRows, conversationRows, messageRows,
    fileRows, deliverableRows, deliverableVersionRows, campaignRows, metricRows,
    notificationRows, stageRows, packageRows, permissionRows] = await Promise.all([
    getCatalogue(),
    t<ProjectRow>('projects', 'select=id,reference,name,status,book_id,project_manager_id,target_date,start_date&order=created_at.desc'),
    t<MilestoneRow>('milestones', 'select=id,project_id,title,completed_at,sort_order&order=sort_order.asc'),
    t<BookRow>('books', 'select=id,title,subtitle,genre,isbn_13,publication_status,target_audience,author_id&order=created_at.desc'),
    t<InvoiceRow>('invoices', 'select=id,invoice_number,status,currency,total_amount,amount_paid,subtotal,tax_amount,issued_at,due_date,notes,project_id,author_id,legal_entity_snapshot&order=issued_at.desc'),
    t<InvoiceItemRow>('invoice_items', 'select=id,invoice_id,description,quantity,unit_price,line_total,sort_order&order=sort_order.asc'),
    t<PaymentRow>('payment_transactions', 'select=id,invoice_id,provider_reference,amount,currency,status,verified_at,created_at&order=created_at.desc'),
    t<TaskRow>('tasks', 'select=id,project_id,title,status,priority,due_date,requires_review&order=created_at.desc'),
    t<ProposalRow>('proposals', 'select=id,reference,title,status,total_amount,currency,valid_until,created_at&order=created_at.desc'),
    t<ProposalVersionRow>('proposal_versions', 'select=id,proposal_id,version_number,total_amount&order=version_number.desc'),
    t<InquiryRow>('inquiries', 'select=id,reference,full_name,email,service_interest,status,source,created_at,assigned_to,spam_score&order=created_at.desc'),
    t<ProfileRow>('profiles', 'select=id,full_name,display_name,email,status'),
    t<AuthorRow>('authors', 'select=id,display_name,primary_email,crm_stage,status,relationship_manager_id,created_at'),
    t<DeptRow>('departments', 'select=id,name,head_user_id,is_active&order=name.asc'),
    t<MembershipRow>('department_memberships', 'select=department_id,user_id'),
    t<UserRoleRow>('user_roles', 'select=user_id,role_id'),
    t<AuditRow>('audit_events', 'select=id,action,entity_type,entity_id,actor_id,metadata,created_at&order=created_at.desc&limit=100'),
    t<SettingRow>('application_settings', 'select=key,value,description,is_public&order=key.asc'),
    t<RoleRow>('roles', 'select=id,slug,name,description&order=name.asc'),
    t<ConversationRow>('conversations', 'select=id,subject,project_id,kind,created_at&order=created_at.desc'),
    t<MessageRow>('messages', 'select=id,conversation_id,sender_user_id,body,visibility,created_at&order=created_at.asc'),
    t<FileRow>('file_metadata', 'select=id,original_name,mime_type,size_bytes,bucket,storage_path,visibility,project_id,created_at&order=created_at.desc'),
    t<DeliverableRow>('deliverables', 'select=id,project_id,title,status,visibility,created_at&order=created_at.desc'),
    t<DeliverableVersionRow>('deliverable_versions', 'select=id,deliverable_id,version_number,created_at&order=version_number.desc'),
    t<CampaignRow>('campaigns', 'select=id,name,status,planned_start,planned_end,project_id&order=created_at.desc'),
    t<MetricRow>('campaign_metrics', 'select=id,campaign_id,metric_name,metric_value,unit,source,source_name,period_start,period_end&order=created_at.desc'),
    t<NotificationRow>('notifications', 'select=id,title,body,link_url,status,channel,created_at,read_at&order=created_at.desc&limit=50'),
    t<StageRow>('crm_pipeline_stages', 'select=id,slug,label,sort_order,is_active&order=sort_order.asc'),
    t<PackageRow>('service_packages', 'select=id,name'),
    t<PermissionRow>('permissions', 'select=id,slug,description&order=slug.asc'),
  ]);

  const profiles = byId(profileRows);
  const books = byId(bookRows);
  const projects = byId(projectRows);
  const authors = byId(authorRows);
  const nameOf = (id?: string|null) => id ? (profiles.get(id)?.full_name ?? authors.get(id)?.display_name ?? '—') : '—';

  const projectVMs: ProjectVM[] = projectRows.map(p => {
    const ms = milestoneRows.filter(m => m.project_id === p.id);
    const done = ms.filter(m => !!m.completed_at).length;
    const status = titleCase(p.status);
    return {
      id: p.id, ref: p.reference ?? p.id.slice(0, 8).toUpperCase(), name: p.name,
      book: p.book_id ? (books.get(p.book_id)?.title ?? '—') : 'Author brand',
      status: status || 'Planning', tone: toneForStatus(p.status),
      progress: ms.length ? Math.round((done / ms.length) * 100) : 0,
      manager: nameOf(p.project_manager_id), due: dateLabel(p.target_date),
      milestones: ms.map(m => ({ label: m.title, done: !!m.completed_at })),
    };
  });

  const invoiceVMs: InvoiceVM[] = invoiceRows.map(i => ({
    id: i.id, number: i.invoice_number, date: dateLabel(i.issued_at), due: dateLabel(i.due_date),
    amount: num(i.total_amount), currency: (i.currency || 'USD').trim(), paid: num(i.amount_paid),
    status: titleCase(i.status), tone: toneForStatus(i.status),
    description: i.notes || 'Services as agreed in your proposal',
    subtotal: num(i.subtotal), tax: num(i.tax_amount), notes: i.notes || '',
    projectId: i.project_id, legalEntity: i.legal_entity_snapshot,
    billTo: i.author_id ? (authors.get(i.author_id)?.display_name ?? 'Client account on file') : 'Client account on file',
    billToEmail: i.author_id ? (authors.get(i.author_id)?.primary_email ?? 'Email on file') : 'Email on file',
    items: itemRows.filter(x => x.invoice_id === i.id).map(x => ({
      description: x.description, quantity: x.quantity, unit: num(x.unit_price), total: num(x.line_total),
    })),
  }));

  const taskVMs: TaskVM[] = taskRows.map(t => ({
    id: t.id, title: t.title, project: projects.get(t.project_id)?.name ?? '—',
    due: dateLabel(t.due_date), status: titleCase(t.status), tone: toneForStatus(t.status),
    priority: titleCase(t.priority), requiresReview: !!t.requires_review,
  }));

  const proposalVMs: ProposalVM[] = proposalRows.map(p => {
    const versions = versionRows.filter(v => v.proposal_id === p.id);
    const latest = versions[0];
    return {
      id: p.reference ?? p.id.slice(0, 8).toUpperCase(), title: p.title,
      version: latest ? `v${latest.version_number}` : 'v1',
      amount: num(latest?.total_amount ?? p.total_amount), currency: (p.currency || 'USD').trim(),
      status: titleCase(p.status), tone: toneForStatus(p.status),
      date: dateLabel(p.created_at), valid: dateLabel(p.valid_until),
    };
  });

  const inquiryVMs: InquiryVM[] = inquiryRows.map(i => ({
    id: i.reference, name: i.full_name, email: i.email,
    interest: i.service_interest || 'General enquiry', stage: titleCase(i.status),
    tone: toneForStatus(i.status), source: titleCase(i.source), date: dateLabel(i.created_at),
    owner: nameOf(i.assigned_to),
  }));

  const roleById = new Map(roleRows.map(r => [r.id, r.name]));
  const teamVMs: TeamVM[] = profileRows.map(p => {
    const roleId = userRoleRows.find(r => r.user_id === p.id)?.role_id;
    const deptId = membershipRows.find(m => m.user_id === p.id)?.department_id;
    return {
      name: p.full_name, role: (roleId && roleById.get(roleId)) || 'Team member',
      dept: deptRows.find(d => d.id === deptId)?.name ?? 'Unassigned',
      status: titleCase(p.status), initials: initials(p.full_name), email: p.email,
    };
  });

  const authorVMs: AuthorVM[] = authorRows.map(a => ({
    id: a.id, name: a.display_name, email: a.primary_email || 'Email on file',
    books: bookRows.filter(b => b.author_id === a.id).length,
    projects: projectRows.filter(p => {
      const b = p.book_id ? books.get(p.book_id) : null;
      return b?.author_id === a.id;
    }).length,
    stage: titleCase(a.crm_stage), status: titleCase(a.status),
    tone: toneForStatus(a.status), manager: nameOf(a.relationship_manager_id),
    created: dateLabel(a.created_at),
  }));

  const auditVMs: AuditVM[] = auditRows.map(a => {
    const meta = (a.metadata ?? {}) as Record<string, unknown>;
    return {
      when: dateLabel(a.created_at), action: titleCase(a.action),
      entity: titleCase(a.entity_type), actor: nameOf(a.actor_id),
      detail: String(meta.reference ?? meta.note ?? a.entity_id ?? 'Record changed'),
      tone: toneForStatus(a.action),
    };
  });

  const conversationVMs = conversationRows.map(c => ({
    id: c.id, subject: c.subject || 'Conversation',
    project: c.project_id ? (projects.get(c.project_id)?.name ?? '—') : 'General',
    kind: titleCase(c.kind), messages: messageRows.filter(m => m.conversation_id === c.id).length,
  }));

  const messageVMs: MessageVM[] = messageRows.map(m => ({
    id: m.id, conversation: m.conversation_id, sender: nameOf(m.sender_user_id),
    body: m.body, visibility: m.visibility, when: dateLabel(m.created_at),
  }));

  const fileVMs: FileVM[] = fileRows.map(f => ({
    id: f.id, name: f.original_name, size: readableSize(f.size_bytes),
    date: dateLabel(f.created_at), status: titleCase(f.visibility), tone: toneForStatus(f.visibility),
    project: f.project_id ? (projects.get(f.project_id)?.name ?? '—') : '—',
    visibility: titleCase(f.visibility), ext: (f.original_name.split('.').pop() ?? 'FILE').slice(0,3).toUpperCase(),
  }));

  const deliverableVMs: DeliverableVM[] = deliverableRows.map(d => {
    const v = deliverableVersionRows.filter(x => x.deliverable_id === d.id)[0];
    return {
      id: d.id, title: d.title, project: projects.get(d.project_id)?.name ?? '—',
      status: titleCase(d.status), tone: toneForStatus(d.status),
      version: v ? `v${v.version_number}` : 'v1', date: dateLabel(v?.created_at ?? d.created_at),
      visibility: d.visibility,
    };
  });

  const campaignNames = new Map(campaignRows.map(c => [c.id, c.name]));
  const resultVMs: ResultVM[] = metricRows.map(m => ({
    id: m.id, metric: titleCase(m.metric_name),
    value: `${m.metric_value}${m.unit && m.unit !== 'count' ? ` ${m.unit}` : ''}`,
    campaign: campaignNames.get(m.campaign_id) ?? '—',
    period: `${dateLabel(m.period_start)} – ${dateLabel(m.period_end)}`,
    source: m.source_name || titleCase(m.source),
  }));

  const reportVMs: ReportVM[] = deliverableVMs
    .filter(d => /report/i.test(d.title) && /client/i.test(d.visibility))
    .map(d => ({
      id: d.id, title: d.title, date: d.date, project: d.project,
      status: d.status, tone: d.tone, version: d.version,
    }));

  const paymentVMs: PaymentVM[] = paymentRows.map(p => ({
    id: p.id, reference: p.provider_reference ?? p.id.slice(0, 8).toUpperCase(),
    amount: num(p.amount), currency: (p.currency || 'USD').trim(), status: titleCase(p.status),
    date: dateLabel(p.verified_at ?? p.created_at), invoiceId: p.invoice_id,
    verified: !!p.verified_at && p.status.toLowerCase() === 'success',
  }));

  const bookVMs: BookVM[] = bookRows.map(b => ({
    id: b.id, title: b.title, subtitle: b.subtitle || '', genre: b.genre || '—',
    isbn: b.isbn_13 || 'Not yet assigned', status: titleCase(b.publication_status),
    audience: b.target_audience || '—',
  }));

  const verified = paymentVMs.filter(p => p.verified && p.status.toLowerCase() === 'success');

  return {
    ok: hasSupabase(), services: catalogue.services, projects: projectVMs,
    invoices: invoiceVMs, books: bookVMs, tasks: taskVMs, proposals: proposalVMs,
    inquiries: inquiryVMs, team: teamVMs, authors: authorVMs,
    departments: deptRows.map(d => ({
      id: d.id, name: d.name, head: nameOf(d.head_user_id), active: d.is_active,
      members: membershipRows.filter(m => m.department_id === d.id).length,
    })),
    audit: auditVMs, settings: settingRows, roles: roleRows,
    conversations: conversationVMs, messages: messageVMs, files: fileVMs,
    deliverables: deliverableVMs, payments: paymentVMs,
    campaigns: campaignRows.map(c => ({ id:c.id, name:c.name, status:titleCase(c.status),
      start:dateLabel(c.planned_start), end:dateLabel(c.planned_end) })),
    metrics: metricRows, results: resultVMs, reports: reportVMs,
    notifications: notificationRows, stages: stageRows, packages: packageRows,
    permissions: permissionRows,
    counts: {
      projects: projectVMs.length,
      activeProjects: projectVMs.filter(p => /active|progress|review/i.test(p.status)).length,
      invoices: invoiceVMs.length,
      outstanding: invoiceVMs.filter(i => !/paid|refund/i.test(i.status)).reduce((s,i) => s + (i.amount - i.paid), 0),
      books: bookVMs.length, tasks: taskVMs.length, proposals: proposalVMs.length,
      inquiries: inquiryVMs.length, team: teamVMs.length, departments: deptRows.length,
      files: fileVMs.length, deliverables: deliverableVMs.length, payments: paymentVMs.length,
      verifiedRevenue: verified.reduce((s,p) => s + p.amount, 0),
      roles: roleRows.length, settings: settingRows.length, campaigns: campaignRows.length,
      audit: auditVMs.length, authors: authorVMs.length, results: resultVMs.length,
      reports: reportVMs.length, packages: packageRows.length, permissions: permissionRows.length,
    },
  };
}

// React cache is request-scoped, so a signed-in user's rows are never shared
// with another request. There is no global cache and no fabricated fallback.
const buildSnapshot = cache(build);
export function getSnapshot(): Promise<Snapshot> { return buildSnapshot(); }

export async function getInvoice(id: string) {
  const s = await getSnapshot();
  return s.invoices.find(i => i.id === id) ?? null;
}
