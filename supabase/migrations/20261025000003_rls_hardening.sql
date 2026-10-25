-- Migration 003 — Tighten the broad `using (true)` read policies from 001.
-- Principle: a signed-in CLIENT must not see internal org structure, role
-- internals, or unrestricted catalogue rows. Staff/admin see what they need.

drop policy if exists "package_items_public_read" on public.service_package_items;
create policy "package_items_public_read" on public.service_package_items for select
  using (
    exists (
      select 1 from public.service_packages sp
      where sp.id = package_id and sp.is_active
        and exists (select 1 from public.services s where s.id = service_package_items.service_id and s.visibility = 'published')
    )
    or public.is_staff()
  );

drop policy if exists "roles_read" on public.roles;
create policy "roles_read" on public.roles for select to authenticated
  using (public.is_staff() or exists (
    select 1 from public.user_roles ur where ur.role_id = roles.id and ur.user_id = auth.uid()
  ));

drop policy if exists "permissions_read" on public.permissions;
create policy "permissions_read" on public.permissions for select to authenticated
  using (public.is_staff());

drop policy if exists "role_permissions_read" on public.role_permissions;
create policy "role_permissions_read" on public.role_permissions for select to authenticated
  using (public.is_staff());

drop policy if exists "org_read" on public.organizations;
create policy "org_read" on public.organizations for select to authenticated
  using (public.is_staff() or public.is_executive());

drop policy if exists "departments_read" on public.departments;
create policy "departments_read" on public.departments for select to authenticated
  using (public.is_staff());

drop policy if exists "positions_read" on public.positions;
create policy "positions_read" on public.positions for select to authenticated
  using (public.is_staff());

drop policy if exists "dept_memberships_read" on public.department_memberships;
create policy "dept_memberships_read" on public.department_memberships for select to authenticated
  using (public.is_staff() or user_id = auth.uid());

drop policy if exists "reporting_read" on public.reporting_relationships;
create policy "reporting_read" on public.reporting_relationships for select to authenticated
  using (public.is_staff() or manager_id = auth.uid() or report_id = auth.uid());

-- Additional guard: clients must never read internal client notes.
drop policy if exists "client_notes_staff_read" on public.client_notes;
create policy "client_notes_staff_read" on public.client_notes for select to authenticated
  using (public.is_staff() or (not is_internal and author_id in (select public.author_ids_for_current_user())));

comment on schema public is
  'Application schema. RLS on all tables; broad read policies hardened in migration 003.';
