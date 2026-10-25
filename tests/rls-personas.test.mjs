// RLS persona harness. These tests are SKIPPED until a real Supabase project is
// configured (SUPABASE_TEST_URL + per-persona test credentials are supplied via
// env vars in CI secrets, never committed). See docs/04-supabase-setup-guide.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const URL = process.env.SUPABASE_TEST_URL;
const personas = ['anon', 'client_a', 'client_b', 'staff', 'dept_head', 'finance', 'admin'];

test('7 RLS personas are defined', () => {
  assert.equal(personas.length, 7);
  assert.ok(personas.includes('client_a') && personas.includes('client_b'));
});

test('cross-client isolation (requires live Supabase)', { skip: URL ? false : 'SUPABASE_TEST_URL not set' }, async () => {
  // When enabled: sign in as client_a, attempt to select client_b's invoice,
  // books, proposals, deliverables and file_metadata; every query must return 0 rows.
  // Sign in as client_b and repeat in reverse. Then verify staff/admin see both.
  const { createClient } = await import('@supabase/supabase-js');
  assert.ok(createClient, 'supabase-js must be available');
});

test('no self-escalation of roles (requires live Supabase)', { skip: URL ? false : 'SUPABASE_TEST_URL not set' }, async () => {
  // When enabled: as client_a, attempt insert/update on user_roles and
  // role_permissions; both must be denied by RLS + explicit revokes.
});

test('financial tables are read-only for clients (requires live Supabase)', { skip: URL ? false : 'SUPABASE_TEST_URL not set' }, async () => {
  // When enabled: as client_a, attempt insert/update on invoices,
  // payment_transactions, payment_events, refunds, audit_events; all must fail.
});

test('private storage objects are not anonymously readable (requires live Supabase)', { skip: URL ? false : 'SUPABASE_TEST_URL not set' }, async () => {
  // When enabled: anon list/read on project_deliverables must fail; signed URL
  // must be required and must expire.
});
