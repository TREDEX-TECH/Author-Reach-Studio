// Pure formatting helpers — no data, safe for server and client.
export const money = (n: number | string | null | undefined, currency = 'USD') => {
  const v = Number(n ?? 0);
  const s = v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return currency === 'USD' ? `$${s}` : `${currency} ${s}`;
};

export const dateLabel = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

export const dateTimeLabel = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  });
};

export const titleCase = (s?: string | null) =>
  (s ?? '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();

export const initials = (name?: string | null) =>
  (name ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '—';

export const toneForStatus = (s?: string | null): string => {
  const v = (s ?? '').toLowerCase();
  if (/paid|verified|approved|active|completed|success|published/.test(v)) return 'ok';
  if (/overdue|blocked|failed|rejected|refund|cancel|expired|urgent|danger/.test(v)) return 'danger';
  if (/review|pending|sent|draft|partial|await|open|new|high/.test(v)) return 'warn';
  if (/progress|qualified|contacted|info/.test(v)) return 'info';
  return 'neutral';
};
