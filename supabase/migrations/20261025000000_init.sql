-- =============================================================================
-- Author Reach Studio — initial schema (Phase 1 foundation)
-- Supabase PostgreSQL. This file is the SOURCE OF TRUTH for schema changes.
-- Apply with: supabase db push   (or paste once via SQL Editor for bootstrap)
-- =============================================================================
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------
create type public.organization_kind       as enum ('parent_company','brand','client_organization');
create type public.account_status          as enum ('invited','active','suspended','deactivated');
create type public.crm_stage               as enum ('new_inquiry','contacted','qualified','proposal_sent','accepted','active_client','completed','inactive','lost');
create type public.inquiry_status          as enum ('new','reviewing','responded','converted','spam','closed');
create type public.service_visibility      as enum ('published','hidden','discontinued');
create type public.pricing_mode            as enum ('fixed','from_price','custom_proposal');
create type public.proposal_status         as enum ('draft','sent','viewed','accepted','declined','expired','superseded');
create type public.project_status          as enum ('planning','active','blocked','paused','in_review','completed','cancelled');
create type public.task_status             as enum ('backlog','todo','in_progress','in_review','changes_requested','approved','completed');
create type public.priority_level          as enum ('low','medium','high','urgent');
create type public.deliverable_visibility  as enum ('internal','client_visible','approved_only');
create type public.approval_decision       as enum ('pending','approved','changes_requested','rejected');
create type public.campaign_status         as enum ('planned','active','paused','completed','cancelled');
create type public.metric_source           as enum ('manual','imported','platform_reported','estimated');
create type public.invoice_status          as enum ('draft','sent','partially_paid','paid','overdue','cancelled','refund_pending','partially_refunded','refunded');
create type public.payment_status          as enum ('initialized','pending','success','failed','abandoned','reversed');
create type public.payment_provider        as enum ('paystack','manual','bank_transfer','other');
create type public.refund_status           as enum ('pending','approved','processing','completed','failed');
create type public.conversation_kind       as enum ('project','support','internal');
create type public.message_visibility      as enum ('client_visible','internal_only');
create type public.notification_channel    as enum ('in_app','email');
create type public.notification_status     as enum ('pending','sent','failed','skipped');
create type public.file_bucket             as enum ('author_assets','project_deliverables','client_documents','marketing_assets','public_site_assets');
create type public.audit_action            as enum ('create','update','delete','role_change','permission_change','invoice_adjustment','payment_verification','proposal_acceptance','approval','config_change','privileged_access');

-- ---------------------------------------------------------------------------
-- SHARED TRIGGER FUNCTIONS
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create or replace function public.prevent_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'This record is immutable: %', tg_table_name using errcode = '55000';
end $$;

create or replace function public.log_audit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_entity_id uuid;
  v_action public.audit_action;
  v_role text := lower(tg_argv[0]);
begin
  if tg_op = 'DELETE' then v_entity_id := old.id; else v_entity_id := new.id; end if;

  v_action := case
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'DELETE' then 'delete'
    when v_role = 'role_change' then 'role_change'
    when v_role = 'invoice_adjustment' then 'invoice_adjustment'
    else 'update'
  end::public.audit_action;

  insert into public.audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), v_action, tg_table_name, v_entity_id,
          jsonb_build_object('op', tg_op, 'table', tg_table_name, 'kind', coalesce(v_role,'generic')));
  if tg_op = 'DELETE' then return old; else return new; end if;
end $$;

-- ---------------------------------------------------------------------------
-- 1. IDENTITY & ORGANISATION
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind public.organization_kind not null default 'brand',
  legal_name text,
  registration_number text,
  registered_address text,
  parent_id uuid references public.organizations(id) on delete set null,
  is_payment_recipient boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.organizations is 'Tredex = parent; Author Reach Studio = brand. Legal/invoice recipient must be the real registered entity.';

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text not null,
  display_name text,
  email text not null,
  phone text,
  avatar_url text,
  timezone text default 'Africa/Lagos',
  locale text default 'en-NG',
  status public.account_status not null default 'invited',
  email_verified boolean not null default false,
  notification_prefs jsonb not null default '{"email":true,"in_app":true,"invoice":true,"project":true}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  description text
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (user_id, role_id)
);
comment on table public.user_roles is 'Only trusted server-side logic may insert/update. No self-service role grant.';

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null unique,
  description text,
  head_user_id uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  is_active boolean not null default true
);
comment on table public.positions is 'Descriptive only. A job title NEVER grants permissions.';

create table public.department_memberships (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  position_id uuid references public.positions(id) on delete set null,
  is_primary boolean not null default false,
  joined_at date default current_date,
  left_at date,
  unique (department_id, user_id)
);

create table public.reporting_relationships (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid not null references public.profiles(id) on delete cascade,
  report_id uuid not null references public.profiles(id) on delete cascade,
  effective_from date not null default current_date,
  effective_to date,
  unique (manager_id, report_id),
  check (manager_id <> report_id)
);

-- ---------------------------------------------------------------------------
-- 2. CLIENTS, AUTHORS, BOOKS, CRM
-- ---------------------------------------------------------------------------
create table public.authors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  display_name text not null,
  legal_name text,
  pen_name text,
  primary_email text,
  phone text,
  country text default 'NG',
  website text,
  bio text,
  relationship_manager_id uuid references public.profiles(id) on delete set null,
  crm_stage public.crm_stage not null default 'new_inquiry',
  acquisition_source text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.authors is 'The author/business ENTITY — distinct from the person who logs in. Supports co-authors, assistants, publisher reps.';

create table public.author_memberships (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  relationship text not null default 'owner', -- owner | co_author | assistant | publisher_rep
  can_accept_proposals boolean not null default false,
  can_pay_invoices boolean not null default false,
  can_view_finance boolean not null default true,
  unique (author_id, user_id)
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id) on delete cascade,
  title text not null,
  subtitle text,
  description text,
  synopsis text,
  genre text,
  categories text[] default '{}',
  language text default 'en',
  publication_status text default 'unpublished',
  publication_date date,
  isbn_10 text,
  isbn_13 text,
  asin text,
  edition text,
  formats text[] default '{}',
  cover_file_id uuid,
  retailer_links jsonb not null default '[]'::jsonb,
  target_audience text,
  marketing_goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.books is 'ISBN/ASIN/publication date are OPTIONAL — unpublished books must not be blocked.';

create table public.book_contributors (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  name text not null,
  role text not null default 'author',
  user_id uuid references public.profiles(id) on delete set null
);

create table public.client_notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id) on delete cascade,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.client_interactions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id) on delete cascade,
  staff_user_id uuid references public.profiles(id) on delete set null,
  channel text not null default 'email',
  summary text not null,
  occurred_at timestamptz not null default now(),
  next_follow_up_at timestamptz
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default 'INQ-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,6)),
  full_name text not null,
  email text not null,
  phone text,
  author_name text,
  book_title text,
  service_interest text,
  message text not null,
  source text not null default 'website',       -- form identifier / page
  source_url text,
  status public.inquiry_status not null default 'new',
  consent_given boolean not null default false,
  spam_score numeric(5,2) default 0,
  converted_author_id uuid references public.authors(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_won boolean not null default false,
  is_lost boolean not null default false
);
comment on table public.crm_pipeline_stages is 'Configurable CRM stages — admins can extend without a code change.';

-- ---------------------------------------------------------------------------
-- 3. SERVICES, PACKAGES, PROPOSALS
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  short_promise text,
  description text,
  scope_of_work text,
  deliverables text[] default '{}',
  eligibility text,
  estimated_duration_days integer,
  pricing_mode public.pricing_mode not null default 'custom_proposal',
  price_amount numeric(14,2),
  currency char(3) default 'USD',
  visibility public.service_visibility not null default 'published',
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pricing_mode = 'custom_proposal' or price_amount is not null)
);

create table public.service_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_amount numeric(14,2),
  currency char(3) default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_package_items (
  package_id uuid not null references public.service_packages(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  primary key (package_id, service_id)
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default 'PROP-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,6)),
  author_id uuid not null references public.authors(id) on delete restrict,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  status public.proposal_status not null default 'draft',
  current_version_id uuid,
  currency char(3) not null default 'USD',
  total_amount numeric(14,2) not null default 0,
  valid_until date,
  terms text,
  prepared_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proposal_versions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  version_number integer not null,
  scope_snapshot jsonb not null,      -- frozen copy of services/deliverables/prices
  terms_snapshot text,
  total_amount numeric(14,2) not null,
  currency char(3) not null default 'USD',
  content_hash text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (proposal_id, version_number)
);
comment on table public.proposal_versions is 'IMMUTABLE. Later service-catalogue edits must never change an accepted version.';

create table public.proposal_items (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.proposal_versions(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  service_name_snapshot text not null,
  description text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(14,2) not null,
  line_total numeric(14,2) generated always as (quantity * unit_price) stored,
  sort_order integer not null default 0
);

create table public.proposal_acceptances (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete restrict,
  version_id uuid not null references public.proposal_versions(id) on delete restrict,
  accepted_by_user_id uuid not null references public.profiles(id) on delete restrict,
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  terms_hash text not null,
  signature_provider text,            -- null = online acceptance; later = e-sign provider id
  unique (proposal_id, version_id)
);

create table public.engagements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id) on delete restrict,
  proposal_id uuid references public.proposals(id) on delete set null,
  accepted_version_id uuid references public.proposal_versions(id) on delete set null,
  reference text not null unique,
  agreed_amount numeric(14,2) not null,
  currency char(3) not null default 'USD',
  started_at date default current_date,
  ended_at date,
  created_at timestamptz not null default now()
);
comment on table public.engagements is 'Commercial link between an accepted proposal and delivered projects.';

-- ---------------------------------------------------------------------------
-- 4. PROJECTS, TASKS, DELIVERY, CAMPAIGNS
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  author_id uuid not null references public.authors(id) on delete restrict,
  engagement_id uuid references public.engagements(id) on delete set null,
  book_id uuid references public.books(id) on delete set null,
  name text not null,
  description text,
  scope text,
  expected_outcomes text,
  status public.project_status not null default 'planning',
  project_manager_id uuid references public.profiles(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  start_date date,
  target_date date,
  completed_at timestamptz,
  completion_criteria text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.projects is 'Progress is derived from real task/milestone records, not a manually typed percentage.';

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_on_project text default 'contributor',
  can_review boolean not null default false,
  primary key (project_id, user_id)
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  sort_order integer not null default 0,
  is_client_visible boolean not null default true,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  title text not null,
  description text,
  status public.task_status not null default 'backlog',
  priority public.priority_level not null default 'medium',
  owner_user_id uuid references public.profiles(id) on delete set null,
  reviewer_user_id uuid references public.profiles(id) on delete set null,
  requires_review boolean not null default true,
  due_date date,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_assignments (
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (task_id, user_id)
);

create table public.task_dependencies (
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  primary key (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  visibility public.message_visibility not null default 'internal_only',
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  author_id uuid not null references public.authors(id) on delete restrict,
  book_id uuid references public.books(id) on delete set null,
  name text not null,
  objective text,
  target_audience text,
  status public.campaign_status not null default 'planned',
  planned_start date,
  planned_end date,
  budget_amount numeric(14,2),
  currency char(3) default 'USD',
  owner_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.campaigns is 'Reports must NOT imply sales without evidence. Store source + methodology on every metric.';

create table public.campaign_channels (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  channel text not null,       -- email | social | retailer | website | publicity | reader_platform
  handle_or_url text,
  is_approved_platform boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  metric_name text not null,   -- impressions | clicks | engagement | reported_sales
  metric_value numeric(18,4) not null,
  unit text default 'count',
  source public.metric_source not null default 'manual',
  source_name text,
  methodology text,
  period_start date not null,
  period_end date not null,
  recorded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  description text,
  visibility public.deliverable_visibility not null default 'internal',
  current_version_id uuid,
  status public.approval_decision not null default 'pending',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deliverable_versions (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid not null references public.deliverables(id) on delete cascade,
  version_number integer not null,
  file_id uuid,
  notes text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (deliverable_id, version_number)
);
comment on table public.deliverable_versions is 'Append-only. A new upload never erases prior work.';

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  version_id uuid references public.deliverable_versions(id) on delete set null,
  decision public.approval_decision not null default 'pending',
  decided_by uuid references public.profiles(id) on delete set null,
  client_visible_feedback text,
  internal_feedback text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  check (deliverable_id is not null or task_id is not null)
);

-- ---------------------------------------------------------------------------
-- 5. FINANCE
-- ---------------------------------------------------------------------------
create sequence public.invoice_number_seq start 1;
create or replace function public.generate_invoice_number()
returns text language sql volatile as $$
  select 'ARS-' || extract(year from now())::int || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');
$$;

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique default public.generate_invoice_number(),
  author_id uuid not null references public.authors(id) on delete restrict,
  engagement_id uuid references public.engagements(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  issued_by uuid references public.profiles(id) on delete set null,
  status public.invoice_status not null default 'draft',
  currency char(3) not null default 'USD',
  subtotal numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  amount_paid numeric(14,2) not null default 0,
  allow_partial boolean not null default false,
  issued_at timestamptz,
  due_date date,
  payment_terms_days integer not null default 14,
  notes text,
  legal_entity_snapshot jsonb,       -- frozen recipient/legal details at issue time
  revision_of uuid references public.invoices(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid >= 0 and amount_paid <= total_amount)
);
comment on table public.invoices is 'Financial status is derived from VERIFIED payment_transactions. Never trust a client update.';

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(14,2) not null,
  line_total numeric(14,2) generated always as (quantity * unit_price) stored,
  service_id uuid references public.services(id) on delete set null,
  sort_order integer not null default 0
);

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  provider public.payment_provider not null default 'paystack',
  provider_reference text not null,
  provider_access_code text,
  provider_authorization_url text,
  amount numeric(14,2) not null check (amount > 0),
  currency char(3) not null default 'USD',
  status public.payment_status not null default 'initialized',
  customer_email text,
  initiated_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  verification_payload jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_reference)
);
comment on table public.payment_transactions is 'UNIQUE provider_reference guarantees a successful event is recorded exactly once.';

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.payment_transactions(id) on delete set null,
  provider_event_id text unique,
  event_type text not null,
  payload jsonb not null,
  signature_valid boolean not null default false,
  processing_result text,
  received_at timestamptz not null default now()
);
comment on table public.payment_events is 'Append-only raw webhook/verification history for idempotency and reconciliation.';

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.payment_transactions(id) on delete restrict,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  provider_reference text unique,
  amount numeric(14,2) not null check (amount > 0),
  currency char(3) not null default 'USD',
  reason text,
  status public.refund_status not null default 'pending',
  requested_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.financial_adjustments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  adjustment_type text not null,   -- credit_note | discount | correction | write_off
  amount numeric(14,2) not null,
  reason text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Derive invoice status from VERIFIED transactions only. SECURITY DEFINER:
-- callable ONLY from trusted server context (service role), never from the browser.
create or replace function public.recalculate_invoice_status(p_invoice_id uuid)
returns public.invoice_status language plpgsql security definer set search_path = '' as $$
declare
  v_total numeric(14,2);
  v_paid numeric(14,2);
  v_due date;
  v_state public.invoice_status;
begin
  select total_amount, due_date, status into v_total, v_due, v_state
  from public.invoices where id = p_invoice_id for update;

  select coalesce(sum(amount), 0) into v_paid
  from public.payment_transactions
  where invoice_id = p_invoice_id and status = 'success' and verified_at is not null;

  if v_state in ('cancelled','refunded','partially_refunded','refund_pending') then
    return v_state;
  end if;

  if v_paid >= v_total and v_total > 0 then
    update public.invoices set amount_paid = v_paid, status = 'paid', updated_at = now() where id = p_invoice_id;
    return 'paid';
  end if;
  if v_paid > 0 then
    update public.invoices set amount_paid = v_paid, status = 'partially_paid', updated_at = now() where id = p_invoice_id;
    return 'partially_paid';
  end if;
  if v_due is not null and v_due < current_date and v_state <> 'draft' then
    update public.invoices set amount_paid = v_paid, status = 'overdue', updated_at = now() where id = p_invoice_id;
    return 'overdue';
  end if;
  update public.invoices set amount_paid = v_paid, updated_at = now() where id = p_invoice_id;
  return v_state;
end $$;

-- ---------------------------------------------------------------------------
-- 6. COMMUNICATIONS, FILES, ACTIVITY, AUDIT, SETTINGS
-- ---------------------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references public.authors(id) on delete cascade,
  subject text,
  kind public.conversation_kind not null default 'project',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  can_post boolean not null default true,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  visibility public.message_visibility not null default 'client_visible',
  attachment_file_id uuid,
  read_by jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link_url text,
  event_key text not null,          -- dedupe key (e.g. invoice:UUID:paid)
  channel public.notification_channel not null default 'in_app',
  status public.notification_status not null default 'pending',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, event_key, channel)
);
comment on table public.notifications is 'UNIQUE(user_id,event_key,channel) prevents duplicate notifications on webhook retries.';

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  provider text not null,
  provider_message_id text,
  attempt integer not null default 1,
  status public.notification_status not null default 'pending',
  provider_response jsonb,
  attempted_at timestamptz not null default now()
);

create table public.file_metadata (
  id uuid primary key default gen_random_uuid(),
  bucket public.file_bucket not null,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  checksum text,
  owner_author_id uuid references public.authors(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  deliverable_id uuid references public.deliverables(id) on delete set null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  visibility public.deliverable_visibility not null default 'internal',
  version_number integer not null default 1,
  scanned_at timestamptz,
  created_at timestamptz not null default now(),
  unique (bucket, storage_path)
);
comment on table public.file_metadata is 'Metadata only. Actual bytes live in Supabase Storage — private buckets by default.';

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references public.authors(id) on delete cascade,
  verb text not null,               -- task_moved | file_uploaded | message_posted | status_changed
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  is_client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_type text not null,
  entity_id uuid,
  before_hash text,
  after_hash text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
comment on table public.audit_events is 'APPEND-ONLY. No UPDATE/DELETE policy exists for any ordinary role.';

create table public.application_settings (
  key text primary key,
  value jsonb not null,
  description text,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Add the books -> file_metadata FK that could not be created earlier
alter table public.books
  add constraint books_cover_file_fkey foreign key (cover_file_id)
  references public.file_metadata(id) on delete set null;
alter table public.deliverable_versions
  add constraint deliverable_versions_file_fkey foreign key (file_id)
  references public.file_metadata(id) on delete set null;
alter table public.messages
  add constraint messages_attachment_fkey foreign key (attachment_file_id)
  references public.file_metadata(id) on delete set null;
alter table public.deliverables
  add constraint deliverables_current_version_fkey foreign key (current_version_id)
  references public.deliverable_versions(id) on delete set null;
alter table public.proposals
  add constraint proposals_current_version_fkey foreign key (current_version_id)
  references public.proposal_versions(id) on delete set null;

-- ---------------------------------------------------------------------------
-- INDEXES (frequently queried columns)
-- ---------------------------------------------------------------------------
create index on public.profiles (email);
create index on public.user_roles (user_id);
create index on public.author_memberships (user_id);
create index on public.authors (crm_stage);
create index on public.books (author_id);
create index on public.inquiries (status, created_at desc);
create index on public.inquiries (source);
create index on public.services (visibility, sort_order);
create index on public.proposals (author_id, status);
create index on public.projects (author_id, status);
create index on public.projects (project_manager_id);
create index on public.project_members (user_id);
create index on public.tasks (project_id, status);
create index on public.tasks (owner_user_id, due_date);
create index on public.deliverables (project_id);
create index on public.deliverable_versions (deliverable_id, version_number desc);
create index on public.campaigns (project_id);
create index on public.campaign_metrics (campaign_id, period_start);
create index on public.invoices (author_id, status);
create index on public.invoices (due_date) where status in ('sent','partially_paid','overdue');
create index on public.payment_transactions (invoice_id);
create index on public.payment_transactions (status, verified_at);
create index on public.payment_events (transaction_id);
create index on public.messages (conversation_id, created_at);
create index on public.notifications (user_id, read_at);
create index on public.file_metadata (project_id, owner_author_id);
create index on public.activity_events (project_id, created_at desc);
create index on public.audit_events (entity_type, entity_id, created_at desc);
create index on public.audit_events (actor_id, created_at desc);

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'organizations','profiles','departments','authors','books','inquiries',
    'services','service_packages','proposals','projects','tasks','campaigns',
    'deliverables','invoices','payment_transactions','application_settings'
  ] loop
    execute format('create trigger trg_set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- Immutable histories
create trigger trg_proposal_versions_immutable
  before update or delete on public.proposal_versions
  for each row execute function public.prevent_mutation();
create trigger trg_payment_events_immutable
  before update or delete on public.payment_events
  for each row execute function public.prevent_mutation();
create trigger trg_audit_events_immutable
  before update or delete on public.audit_events
  for each row execute function public.prevent_mutation();
create trigger trg_proposal_items_immutable
  before update or delete on public.proposal_items
  for each row execute function public.prevent_mutation();

-- Audit sensitive state changes (server-side writes)
create trigger trg_audit_invoices after insert or update on public.invoices
  for each row execute function public.log_audit('invoice_adjustment');
create trigger trg_audit_user_roles after insert or update or delete on public.user_roles
  for each row execute function public.log_audit('role_change');

-- ---------------------------------------------------------------------------
-- AUTHORISATION HELPERS (security definer; owned by postgres -> bypasses RLS)
-- ---------------------------------------------------------------------------
create or replace function public.has_role(p_slug text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.slug = p_slug
      and (ur.expires_at is null or ur.expires_at > now())
  );
$$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select public.has_role('administrator');
$$;
create or replace function public.is_finance() returns boolean language sql stable security definer set search_path = '' as $$
  select public.has_role('finance_officer') or public.has_role('administrator');
$$;
create or replace function public.is_executive() returns boolean language sql stable security definer set search_path = '' as $$
  select public.has_role('executive') or public.has_role('administrator');
$$;
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = '' as $$
  select public.has_role('team_member') or public.has_role('department_head')
      or public.has_role('project_manager') or public.has_role('finance_officer')
      or public.has_role('executive') or public.has_role('administrator');
$$;

create or replace function public.author_ids_for_current_user()
returns setof uuid language sql stable security definer set search_path = '' as $$
  select am.author_id from public.author_memberships am where am.user_id = auth.uid();
$$;

create or replace function public.can_access_project(p_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = p_project_id and pm.user_id = auth.uid()
  ) or public.is_admin() or public.is_executive();
$$;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — enabled on EVERY application table
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'organizations','profiles','roles','permissions','user_roles','role_permissions',
    'departments','positions','department_memberships','reporting_relationships',
    'authors','author_memberships','books','book_contributors','client_notes',
    'client_interactions','inquiries','crm_pipeline_stages','services',
    'service_packages','service_package_items','proposals','proposal_versions',
    'proposal_items','proposal_acceptances','engagements','projects','project_members',
    'milestones','tasks','task_assignments','task_dependencies','task_comments',
    'campaigns','campaign_channels','campaign_metrics','deliverables',
    'deliverable_versions','approvals','invoices','invoice_items',
    'payment_transactions','payment_events','refunds','financial_adjustments',
    'conversations','conversation_members','messages','notifications',
    'notification_deliveries','file_metadata','activity_events','audit_events',
    'application_settings'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Public read of published catalogue content (anon + authenticated).
create policy "services_public_read" on public.services for select using (visibility = 'published');
create policy "packages_public_read" on public.service_packages for select using (is_active);
create policy "package_items_public_read" on public.service_package_items for select using (true);
create policy "stages_public_read" on public.crm_pipeline_stages for select using (is_active);
create policy "settings_public_read" on public.application_settings for select using (is_public);

-- Profiles: self, staff (directory), admins.
create policy "profiles_self_read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());
create policy "profiles_self_update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Roles are readable by signed-in users; only admins may change them.
create policy "roles_read" on public.roles for select to authenticated using (true);
create policy "permissions_read" on public.permissions for select to authenticated using (true);
create policy "role_permissions_read" on public.role_permissions for select to authenticated using (true);
create policy "user_roles_read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
-- NOTE: no INSERT/UPDATE/DELETE policy for user_roles -> only the service-role
-- server function (which bypasses RLS) can grant roles. No self-escalation.

-- Organisation structure: staff read; admins write.
create policy "org_read" on public.organizations for select to authenticated using (true);
create policy "departments_read" on public.departments for select to authenticated using (true);
create policy "positions_read" on public.positions for select to authenticated using (true);
create policy "dept_memberships_read" on public.department_memberships for select to authenticated using (true);
create policy "reporting_read" on public.reporting_relationships for select to authenticated using (true);

-- Clients & books: author members see their own; staff see their assigned records.
create policy "authors_read" on public.authors for select to authenticated
  using (id in (select public.author_ids_for_current_user()) or public.is_staff());
create policy "author_memberships_read" on public.author_memberships for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_staff());
create policy "books_read" on public.books for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_staff());
create policy "books_cover_public_read" on public.books for select to anon
  using (false); -- covers are served via signed URLs / public-site bucket, never raw rows

-- Inquiries: NO anonymous SELECT. Insert only through the trusted Netlify Function.
create policy "inquiries_staff_read" on public.inquiries for select to authenticated using (public.is_staff());
create policy "client_notes_staff_read" on public.client_notes for select to authenticated using (public.is_staff() or not is_internal);
create policy "interactions_staff_read" on public.client_interactions for select to authenticated using (public.is_staff());

-- Proposals: author members read their own; staff read all; writes are server-side.
create policy "proposals_read" on public.proposals for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_staff());
create policy "proposal_versions_read" on public.proposal_versions for select to authenticated
  using (proposal_id in (select p.id from public.proposals p));
create policy "proposal_items_read" on public.proposal_items for select to authenticated
  using (version_id in (select pv.id from public.proposal_versions pv));
create policy "acceptances_read" on public.proposal_acceptances for select to authenticated
  using (public.is_staff() or accepted_by_user_id = auth.uid());
create policy "engagements_read" on public.engagements for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_staff());

-- Projects: author members see their own projects; staff see projects they belong to.
create policy "projects_read" on public.projects for select to authenticated
  using (author_id in (select public.author_ids_for_current_user())
         or public.can_access_project(id) or public.is_staff());
create policy "project_members_read" on public.project_members for select to authenticated
  using (public.can_access_project(project_id));
create policy "milestones_read" on public.milestones for select to authenticated
  using (is_client_visible and project_id in (select id from public.projects)
         or public.can_access_project(project_id));
create policy "tasks_read" on public.tasks for select to authenticated
  using (public.can_access_project(project_id) or owner_user_id = auth.uid());
create policy "tasks_member_update" on public.tasks for update to authenticated
  using (public.can_access_project(project_id) or owner_user_id = auth.uid())
  with check (true);
create policy "task_assignments_read" on public.task_assignments for select to authenticated
  using (task_id in (select t.id from public.tasks t));
create policy "task_deps_read" on public.task_dependencies for select to authenticated
  using (task_id in (select t.id from public.tasks t));
create policy "task_comments_read" on public.task_comments for select to authenticated
  using (public.is_staff() or (visibility = 'client_visible'
         and task_id in (select t.id from public.tasks t)));

-- Deliverables: clients see only approved / client-visible versions.
create policy "deliverables_read" on public.deliverables for select to authenticated
  using (visibility = 'client_visible' or visibility = 'approved_only' or public.is_staff());
create policy "deliverable_versions_read" on public.deliverable_versions for select to authenticated
  using (public.is_staff() or deliverable_id in (select id from public.deliverables where visibility <> 'internal'));
create policy "approvals_read" on public.approvals for select to authenticated
  using (public.is_staff() or public.can_access_project(
    (select project_id from public.deliverables d where d.id = deliverable_id)));

-- Campaigns & clients see only client-safe, measured data.
create policy "campaigns_read" on public.campaigns for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_staff());
create policy "campaign_channels_read" on public.campaign_channels for select to authenticated
  using (campaign_id in (select c.id from public.campaigns c));
create policy "campaign_metrics_read" on public.campaign_metrics for select to authenticated
  using (public.is_staff() or campaign_id in (select id from public.campaigns));

-- Finance: authors read ONLY their own invoices; finance/admins manage.
create policy "invoices_read" on public.invoices for select to authenticated
  using (author_id in (select public.author_ids_for_current_user()) or public.is_finance());
create policy "invoice_items_read" on public.invoice_items for select to authenticated
  using (invoice_id in (select id from public.invoices));
create policy "payment_transactions_read" on public.payment_transactions for select to authenticated
  using (invoice_id in (select id from public.invoices));
-- Deliberately NO client UPDATE on invoices/payments. Only the service-role
-- verification function writes financial state.
create policy "refunds_finance_read" on public.refunds for select to authenticated using (public.is_finance());
create policy "adjustments_finance_read" on public.financial_adjustments for select to authenticated using (public.is_finance());
create policy "payment_events_finance_read" on public.payment_events for select to authenticated using (public.is_finance());

-- Conversations: members only; internal messages hidden from clients.
create policy "conversations_read" on public.conversations for select to authenticated
  using (id in (select cm.conversation_id from public.conversation_members cm where cm.user_id = auth.uid())
         or public.is_admin());
create policy "conversation_members_read" on public.conversation_members for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "messages_read" on public.messages for select to authenticated
  using ((public.is_staff() and (visibility = 'internal_only' or true))
         or (visibility = 'client_visible' and conversation_id in (
             select cm.conversation_id from public.conversation_members cm
             where cm.user_id = auth.uid()))
         or sender_user_id = auth.uid());
create policy "messages_insert" on public.messages for insert to authenticated
  with check (sender_user_id = auth.uid() and conversation_id in (
    select cm.conversation_id from public.conversation_members cm
    where cm.user_id = auth.uid() and cm.can_post));

-- Notifications: strictly own rows.
create policy "notifications_own" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications_own_update" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notification_deliveries_read" on public.notification_deliveries for select to authenticated
  using (public.is_admin());
create policy "activity_events_read" on public.activity_events for select to authenticated
  using (public.is_staff() or (is_client_visible and (
           author_id in (select public.author_ids_for_current_user())
           or (project_id is not null and public.can_access_project(project_id)))));

-- Files: author/project scoped; never guessable cross-client paths.
create policy "files_read" on public.file_metadata for select to authenticated
  using (public.is_staff()
         or owner_author_id in (select public.author_ids_for_current_user())
         or (project_id is not null and public.can_access_project(project_id)));
create policy "files_insert" on public.file_metadata for insert to authenticated
  with check (uploaded_by = auth.uid());
create policy "book_contributors_read" on public.book_contributors for select to authenticated
  using (book_id in (select b.id from public.books b));

-- Audit: admin/executive read only. No update/delete policy at all.
create policy "audit_read" on public.audit_events for select to authenticated
  using (public.is_admin() or public.is_executive());

-- ---------------------------------------------------------------------------
-- SEED ROLES / PERMISSIONS / SETTINGS (safe for production)
-- ---------------------------------------------------------------------------
insert into public.roles (slug, name, description, is_system) values
  ('visitor',          'Public visitor',        'Unauthenticated browsing and inquiry submission', true),
  ('author',           'Author / client',       'Manages own books, projects, invoices, deliverables', true),
  ('team_member',      'Team member',           'Completes assigned work', true),
  ('department_head',  'Department head',       'Coordinates department staff and internal review', true),
  ('project_manager',  'Project manager',       'Manages assigned projects, milestones and reviews', true),
  ('finance_officer',  'Finance officer',       'Invoices and verified-payment reconciliation', true),
  ('administrator',    'Administrator',         'Users, roles, configuration — highest privilege', true),
  ('executive',        'Executive / owner',     'Authorised management views and business reports', true)
on conflict (slug) do nothing;

insert into public.permissions (slug, description) values
  ('content.manage','Create and edit public website content'),
  ('crm.manage','Manage inquiries and client records'),
  ('org.manage','Manage departments, positions and staff memberships'),
  ('roles.manage','Grant and revoke roles and permissions'),
  ('proposal.manage','Create and send proposals'),
  ('project.manage','Create projects, milestones and assignments'),
  ('task.update','Update assigned task status'),
  ('review.approve','Approve work or request changes'),
  ('invoice.manage','Create, send and adjust invoices'),
  ('payment.reconcile','Reconcile verified payments and refunds'),
  ('report.finance','View financial reports'),
  ('report.delivery','View delivery/workload reports'),
  ('settings.manage','Change application configuration'),
  ('audit.read','Read audit events')
on conflict (slug) do nothing;

insert into public.crm_pipeline_stages (slug, label, sort_order, is_won, is_lost) values
  ('new_inquiry','New inquiry',1,false,false),
  ('contacted','Contacted',2,false,false),
  ('qualified','Qualified',3,false,false),
  ('proposal_sent','Proposal sent',4,false,false),
  ('accepted','Accepted',5,true,false),
  ('active_client','Active client',6,true,false),
  ('completed','Completed',7,true,false),
  ('inactive','Inactive',8,false,false),
  ('lost','Lost',9,false,true)
on conflict (slug) do nothing;

insert into public.application_settings (key, value, description, is_public) values
  ('payments.allow_partial', 'false', 'Allow instalment payments on invoices by default', false),
  ('payments.currencies', '["USD"]', 'Currencies enabled for invoicing (must match Paystack merchant)', false),
  ('payments.provider', '"paystack"', 'Active payment provider', false),
  ('invoices.payment_terms_days', '14', 'Default payment terms in days', false),
  ('proposals.validity_days', '30', 'Default proposal validity period', false),
  ('registration.clients', '"invite_only"', 'invite_only | self_serve | approval_required', false),
  ('registration.staff', '"admin_invite"', 'How staff accounts are created', false),
  ('files.max_document_mb', '25', 'Max client document size in MB', false),
  ('files.max_video_mb', '500', 'Max video deliverable size in MB', false),
  ('branding.parent_name', '"Tredex"', 'Parent business identity', true),
  ('branding.brand_name', '"Author Reach Studio"', 'Specialist brand name', true),
  ('branding.relationship', '"Author Reach Studio is a specialist brand of Tredex."', 'Public relationship statement', true)
on conflict (key) do nothing;

-- =============================================================================
-- END OF INITIAL MIGRATION
-- Next migrations add: full per-module write policies, storage policies,
-- notification functions, invoice RPCs, reporting views, and RLS test fixtures.
-- =============================================================================
