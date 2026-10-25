-- =============================================================================
-- Security RPCs + privilege hardening
-- =============================================================================

-- Explicit ownership check used by paystack-initialize (defence in depth on top of RLS).
create or replace function public.is_invoice_payable_by(p_invoice_id uuid, p_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.invoices i
    join public.author_memberships am on am.author_id = i.author_id
    where i.id = p_invoice_id
      and am.user_id = p_user_id
      and am.can_pay_invoices = true
  );
$$;

-- Only the trusted server (service role) may recalculate financial state.
-- Ordinary clients must NEVER be able to call this RPC through the Data API.
revoke all on function public.recalculate_invoice_status(uuid) from public, anon, authenticated;
grant execute on function public.recalculate_invoice_status(uuid) to service_role;

revoke all on function public.is_invoice_payable_by(uuid, uuid) from public, anon, authenticated;
grant execute on function public.is_invoice_payable_by(uuid, uuid) to service_role;

-- Revoke direct writes to financial tables from the authenticated role. The
-- webhook uses the service-role key (which bypasses RLS) and is the only writer.
revoke insert, update, delete on public.payment_transactions from authenticated;
revoke insert, update, delete on public.payment_events from authenticated;
revoke insert, update, delete on public.refunds from authenticated;
revoke insert, update, delete on public.financial_adjustments from authenticated;
revoke insert, update, delete on public.invoices from authenticated;
revoke insert, update, delete on public.invoice_items from authenticated;
revoke insert, update, delete on public.audit_events from authenticated;
revoke update, delete on public.user_roles from authenticated;
revoke insert on public.user_roles from authenticated;
revoke update, delete on public.role_permissions from authenticated;

-- Read helpers must remain callable by authenticated users (used inside RLS policies).
grant execute on function public.has_role(text) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_finance() to authenticated;
grant execute on function public.is_executive() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.author_ids_for_current_user() to authenticated;
grant execute on function public.can_access_project(uuid) to authenticated;

-- Storage bucket registry (actual buckets created in the Supabase dashboard/CLI).
comment on schema public is 'Application schema. All tables have RLS enabled. See docs/05-security-model.md.';
