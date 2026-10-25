-- Migration 004 — Auth profile provisioning, capability matrix, draft org skeleton.
-- Runs after 001/003. Contains NO client data and NO fabricated business results.
-- The organisation rows are explicitly DRAFT placeholders: replace before any
-- real invoice or live payment (owner decision 26).

-- ---------------------------------------------------------------------------
-- 1. Every new auth.users row gets exactly one public.profiles row.
--    Invite-only signup is enforced in Auth config; this trigger only
--    provisions the profile. Roles are NEVER granted here — an admin must
--    grant them explicitly through a trusted server function.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(coalesce(new.email, 'user'), '@', 1)
  );

  insert into public.profiles (id, full_name, display_name, email, email_verified, status)
  values (
    new.id,
    v_name,
    v_name,
    coalesce(new.email, ''),
    (new.email_confirmed_at is not null),
    'invited'
  )
  on conflict (id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep email_verified in sync when a user confirms their address.
create or replace function public.sync_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email_verified = (new.email_confirmed_at is not null),
         email = coalesce(new.email, email)
   where id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.sync_email_confirmed();

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.sync_email_confirmed() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Capability matrix. A job title never grants permissions — only these
--    explicit role→permission rows do. Configurable from admin later.
-- ---------------------------------------------------------------------------
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where (
  -- Administrator: every capability.
  r.slug = 'administrator'
  -- Executive: oversight, finance, delivery, org, content; no role/permission editing.
  or (r.slug = 'executive' and p.slug in (
      'audit.read','content.manage','crm.manage','invoice.manage','org.manage',
      'payment.reconcile','project.manage','proposal.manage','report.delivery',
      'report.finance','review.approve','settings.manage'))
  -- Finance officer: money + reconciliation + audit.
  or (r.slug = 'finance_officer' and p.slug in (
      'audit.read','crm.manage','invoice.manage','payment.reconcile','report.finance'))
  -- Project manager: delivery lifecycle.
  or (r.slug = 'project_manager' and p.slug in (
      'content.manage','crm.manage','project.manage','proposal.manage',
      'report.delivery','review.approve','task.update'))
  -- Department head: team delivery + reviews.
  or (r.slug = 'department_head' and p.slug in (
      'project.manage','report.delivery','review.approve','task.update'))
  -- Team member: only their own task updates and delivery reporting.
  or (r.slug = 'team_member' and p.slug in ('report.delivery','task.update'))
  -- Author/client and visitor: no staff capabilities.
)
on conflict (role_id, permission_id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Draft organisation skeleton. Clearly marked so no real invoice can
--    accidentally use them. is_payment_recipient is FALSE until the owner
--    supplies the real registered entity.
-- ---------------------------------------------------------------------------
insert into public.organizations
  (id, name, kind, legal_name, registration_number, registered_address, is_payment_recipient)
values
  ('11111111-1111-4111-8111-111111111111', 'Tredex', 'parent_company',
   'DRAFT — replace with registered legal name', 'DRAFT-RC-NUMBER',
   'DRAFT — replace with registered business address', false),
  ('22222222-2222-4222-8222-222222222222', 'Author Reach Studio', 'brand',
   null, null, null, false)
on conflict (id) do nothing;

update public.organizations
   set parent_id = '11111111-1111-4111-8111-111111111111'
 where id = '22222222-2222-4222-8222-222222222222' and parent_id is null;

-- Guard used by payment code: refuse live charges until the entity is real.
create or replace function public.payment_entity_is_configured()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organizations
    where is_payment_recipient
      and legal_name is not null
      and legal_name not like 'DRAFT%'
      and registration_number is not null
      and registration_number not like 'DRAFT%'
  );
$$;

grant execute on function public.payment_entity_is_configured() to authenticated, service_role;

comment on table public.organizations is
  'Parent/brand/legal entities. DRAFT placeholders must be replaced with the real registered entity before any live invoice or payment.';
