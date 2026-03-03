/**
 * One-time script: create two test users (member + viewer) in Supabase Auth.
 * Run from project root: npm run create-test-users
 *
 * Requires .env with: VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)
 * Default password for both: TestUser123!
 */

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/^\uFEFF/, '');
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
const DEFAULT_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestUser123!';

const TEST_USERS = [
  { email: 'member@test.frontierfinance.org', fullName: 'Test Member', role: 'member', companyName: 'Test Member Co' },
  { email: 'viewer@test.frontierfinance.org', fullName: 'Test Viewer', role: 'viewer', companyName: 'Test Viewer Co' },
];

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing env. In .env set: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
    console.error('Loaded .env from:', loadedFrom || 'none');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('Creating test users (member + viewer)...');
  console.log('Password for both:', DEFAULT_PASSWORD);
  console.log('');

  for (const { email, fullName, role, companyName } of TEST_USERS) {
    try {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (found) {
        console.log(`  Skip (already exists): ${email}`);
        const userId = found.id;
        await ensureProfileAndRole(supabase, userId, email, fullName, companyName, role);
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

      const userId = data.user?.id;
      if (!userId) {
        console.error(`  No user id for ${email}`);
        continue;
      }
      console.log(`  Created auth: ${email} (${userId})`);

      await ensureProfileAndRole(supabase, userId, email, fullName, companyName, role);
    } catch (err) {
      console.error(`  Error ${email}:`, err.message);
    }
  }

  console.log('');
  console.log('Done. You can sign in with:');
  console.log('  Member: member@test.frontierfinance.org');
  console.log('  Viewer: viewer@test.frontierfinance.org');
  console.log('  Password: ' + DEFAULT_PASSWORD);
}

async function ensureProfileAndRole(supabase, userId, email, fullName, companyName, role) {
  const { error: profileErr } = await supabase
    .from('user_profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        company_name: companyName,
        user_role: role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (profileErr) {
    console.error(`    user_profiles: ${profileErr.message}`);
  } else {
    console.log(`    user_profiles: ok (${role})`);
  }

  const { data: existingRole } = await supabase.from('user_roles').select('user_id').eq('user_id', userId).single();
  if (existingRole) {
    const { error: roleUpdateErr } = await supabase
      .from('user_roles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (roleUpdateErr) console.error(`    user_roles update: ${roleUpdateErr.message}`);
    else console.log(`    user_roles: updated to ${role}`);
  } else {
    const { error: roleInsertErr } = await supabase.from('user_roles').insert({
      user_id: userId,
      role,
    });
    if (roleInsertErr) console.error(`    user_roles insert: ${roleInsertErr.message}`);
    else console.log(`    user_roles: inserted ${role}`);
  }
}

main();
