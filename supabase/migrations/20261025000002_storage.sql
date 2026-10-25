-- Migration 002 — Private Storage buckets, object policies, and upload guardrails.
-- Runs after 001. Buckets are PRIVATE by default. Bytes are only reachable via
-- short-lived signed URLs issued by trusted server code after an ownership check.

-- ---------------------------------------------------------------------------
-- 1. Bucket registry (private by default; public_site_assets is the only
--    intentionally public bucket, and only for published marketing images).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('author_assets',         'author_assets',         false, 52428800,  array['image/jpeg','image/png','image/webp','application/pdf']),
  ('project_deliverables',  'project_deliverables',  false, 209715200, array['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf','application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','video/mp4','audio/mpeg']),
  ('client_documents',      'client_documents',      false, 52428800,  array['application/pdf','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('marketing_assets',      'marketing_assets',      false, 104857600, array['image/jpeg','image/png','image/webp','image/svg+xml','video/mp4','application/pdf']),
  ('public_site_assets',    'public_site_assets',    true,  10485760,  array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 2. Path convention helpers.
--    Every private object path MUST start with a UUID scope:
--      author_assets/<author_id>/...
--      project_deliverables/<project_id>/...
--      client_documents/<author_id>/...
--      marketing_assets/<project_id|campaign_id>/...
--    Server code writes the matching file_metadata row in the same transaction.
-- ---------------------------------------------------------------------------
create or replace function public.storage_scope_id(p_name text)
returns uuid language sql immutable set search_path = '' as $$
  select nullif(split_part(p_name, '/', 2), '')::uuid;
$$;

create or replace function public.can_read_storage_object(p_bucket_id text, p_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case
    -- Public marketing images: anyone may read.
    when p_bucket_id = 'public_site_assets' then true
    -- Staff and executives may read internal working files.
    when public.is_admin() or public.is_executive() then true
    -- Client-visible files require an explicit file_metadata row with the right scope.
    when p_bucket_id in ('author_assets','client_documents') then
      public.storage_scope_id(p_name) in (select public.author_ids_for_current_user())
      and exists (
        select 1 from public.file_metadata fm
        where fm.bucket::text = p_bucket_id and fm.storage_path = p_name
          and (fm.visibility in ('client_visible','approved_only') or public.is_staff())
      )
    when p_bucket_id in ('project_deliverables','marketing_assets') then
      public.can_access_project(public.storage_scope_id(p_name))
      and exists (
        select 1 from public.file_metadata fm
        where fm.bucket::text = p_bucket_id and fm.storage_path = p_name
          and (fm.visibility in ('client_visible','approved_only') or public.is_staff())
      )
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- 3. storage.objects policies — NO anonymous write path. All inserts/updates
--    go through trusted server code with the service-role key, which bypasses
--    RLS. The policies below are a second line of defence for authenticated
--    direct uploads, and they enforce the path convention above.
-- ---------------------------------------------------------------------------
create policy "storage_public_site_read" on storage.objects for select
  using (bucket_id = 'public_site_assets');

create policy "storage_authenticated_read" on storage.objects for select
  to authenticated
  using (public.can_read_storage_object(bucket_id, name));

create policy "storage_staff_insert" on storage.objects for insert
  to authenticated
  with check (
    public.is_staff()
    and bucket_id in ('author_assets','project_deliverables','client_documents','marketing_assets','public_site_assets')
    and public.storage_scope_id(name) is not null
  );

create policy "storage_staff_update" on storage.objects for update
  to authenticated
  using (public.is_staff() and public.can_read_storage_object(bucket_id, name))
  with check (public.is_staff() and public.storage_scope_id(name) is not null);

-- Deliberately NO delete policy for authenticated users. File deletion is a
-- soft-delete on file_metadata; bytes are purged by an audited server job.

grant execute on function public.storage_scope_id(text) to authenticated, service_role;
grant execute on function public.can_read_storage_object(text, text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 4. file_metadata: clients see only client-visible files in their own scope.
-- ---------------------------------------------------------------------------
create policy "file_metadata_client_read" on public.file_metadata for select
  to authenticated
  using (
    public.is_staff()
    or (visibility in ('client_visible','approved_only') and (
      owner_author_id in (select public.author_ids_for_current_user())
      or (project_id is not null and public.can_access_project(project_id))
    ))
  );

create policy "file_metadata_staff_insert" on public.file_metadata for insert
  to authenticated
  with check (public.is_staff() and uploaded_by = auth.uid());

-- No update/delete policies: versions are append-only. Corrections add a new row.
comment on table public.file_metadata is
  'Append-only file registry. Bytes live in PRIVATE Supabase Storage buckets; serve via short-lived signed URLs after can_read_storage_object() returns true.';
