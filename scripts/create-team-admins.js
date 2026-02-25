/**
 * One-time script: create all 6 CFF team admin accounts in Supabase Auth.
 * Run from project root: npm run create-team-admins
 *
 * Requires .env with: VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)
 * Default password for all: ChangeMe123!
 * After running, run sql/users/team_admins_setup.sql to set admin roles and profiles.
 */

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/^\uFEFF/, ''); // BOM
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.replace(/\r$/, '').trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).replace(/\r$/, '').trim();
    let val = trimmed.slice(eq + 1).replace(/\r$/, '').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
  return true;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const cwd = process.cwd();
// Prefer .env next to package.json (projectRoot); then cwd
const envPaths = [join(projectRoot, '.env'), join(cwd, '.env'), join(projectRoot, '..', '.env')];
let loadedFrom = null;
for (const p of envPaths) {
  if (fs.existsSync(p) && loadEnvFile(p)) {
    loadedFrom = p;
    break;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const DEFAULT_PASSWORD = process.env.TEAM_ADMIN_PASSWORD || 'ChangeMe123!';

const TEAM_MEMBERS = [
  { email: 'lisa@frontierfinance.org', fullName: 'Lisa Mwende' },
  { email: 'alfred@frontierfinance.org', fullName: 'Alfred Mulinge' },
  { email: 'arnold@frontierfinance.org', fullName: 'Arnold Byarugaba' },
  { email: 'drew@frontierfinance.org', fullName: 'Drew von Glahn' },
  { email: 'gila@frontierfinance.org', fullName: 'Gila Norich' },
  { email: 'alexandra@frontierfinance.org', fullName: 'Alexandra von Glahn' },
];

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing env. In .env set: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
    console.error('Loaded .env from:', loadedFrom || 'none (tried: ' + envPaths.join(', ') + ')');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

  console.log('Creating CFF team admin accounts...');
  console.log('Password for all:', DEFAULT_PASSWORD);
  console.log('');

  for (const { email, fullName } of TEAM_MEMBERS) {
    try {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (found) {
        console.log(`  Skip (already exists): ${email}`);
        continue;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (error) {
        console.error(`  Failed ${email}:`, error.message);
        continue;
      }
      console.log(`  Created: ${email} (${data.user?.id || 'ok'})`);
    } catch (err) {
      console.error(`  Error ${email}:`, err.message);
    }
  }

  console.log('');
  console.log('Done. Next: run sql/users/team_admins_setup.sql in Supabase SQL Editor to set admin roles and profiles.');
}

main();
