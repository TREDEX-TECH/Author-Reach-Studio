// Quick pre-deploy sanity check. Run: node scripts/verify.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const checks = [
  ['package.json', existsSync(join(root,'package.json'))],
  ['.env.example', existsSync(join(root,'.env.example'))],
  ['netlify.toml', existsSync(join(root,'netlify.toml'))],
  ['migrations present', readdirSync(join(root,'supabase/migrations')).some(f=>f.endsWith('.sql'))],
  ['docs present', readdirSync(join(root,'docs')).length >= 7],
  ['demo data removed', !existsSync(join(root,'lib/demo-data.ts'))],
  ['auth gate documented', readFileSync(join(root,'.env.example'),'utf8').includes('REQUIRE_AUTH')],
  ['no real keys in repo', !readFileSync(join(root,'.env.example'),'utf8').includes('sk_live_')],
];
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`);
if (checks.some(([,ok])=>!ok)) process.exit(1);
console.log('\nAll foundation checks passed. Run `npm test` for the full suite.');
