import Link from 'next/link';
import { EmptyState } from './ui';

/** Honest, reusable empty state. Never substitutes invented records. */
export function EmptyRecords({ noun, body, href, action }: {
  noun: string; body?: string; href?: string; action?: string;
}) {
  return (
    <EmptyState
      icon="◇"
      title={`No ${noun} yet`}
      body={body ?? `When ${noun} are created they appear here automatically. This page reads live records from the database — nothing is shown until real data exists.`}
      action={href ? <Link href={href} className="btn btn-outline btn-sm">{action ?? 'Get started →'}</Link> : undefined}
    />
  );
}
