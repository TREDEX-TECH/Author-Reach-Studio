// Browser return from Paystack checkout. INFORMATIONAL ONLY — never marks an invoice paid.
import { json, methodNotAllowed, type FnEvent } from './_shared';

export async function handler(event: FnEvent) {
  if (event.httpMethod !== 'GET') return methodNotAllowed();
  const ref = event.queryStringParameters?.reference ?? event.queryStringParameters?.trxref ?? '';
  const safe = encodeURIComponent(String(ref).slice(0, 120));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    statusCode: 302,
    headers: {
      location: `${siteUrl}/portal/invoices?checkout=returned&ref=${safe}`,
      'cache-control': 'no-store',
    },
    body: '',
  } as ReturnType<typeof json>;
}
