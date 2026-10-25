'use client';
export function PrintButton({ label = '🖨 Print / Save PDF', className = 'btn btn-outline btn-sm' }: { label?: string; className?: string }) {
  return <button type="button" className={className} onClick={() => window.print()}>{label}</button>;
}
