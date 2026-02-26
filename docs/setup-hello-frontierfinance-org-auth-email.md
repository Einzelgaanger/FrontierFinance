# Use hello@frontierfinance.org for auth emails (password recovery, etc.)

This guide gets Supabase sending all auth emails (password reset, magic links, etc.) from **hello@frontierfinance.org** using Resend.

---

## Part 1: Verify the domain in Resend

### 1.1 Log in to Resend

- Go to [resend.com](https://resend.com) and sign in (or create an account).
- You need an API key from Resend for Supabase; if you already use Resend for Supabase SMTP, you’re set.

### 1.2 Add the domain

1. In Resend, open **Domains** ([resend.com/domains](https://resend.com/domains)).
2. Click **Add Domain**.
3. Enter: **`frontierfinance.org`** (no `www`, no `https`).
4. Click **Add** (or **Verify**).

### 1.3 Add DNS records

Resend will show you DNS records (SPF, DKIM, etc.) that must exist for `frontierfinance.org`.

1. Note the **record type**, **name/host**, and **value** for each record (e.g. TXT for SPF, TXT for DKIM, sometimes CNAME).
2. Log in to wherever **frontierfinance.org** DNS is managed (e.g. Cloudflare, GoDaddy, Namecheap, your registrar).
3. Open the DNS / DNS records section for **frontierfinance.org**.
4. For each record Resend shows:
   - **Name/Host**: Use exactly what Resend gives. It might be:
     - `@` or `frontierfinance.org` for the root domain, or
     - something like `resend._domainkey` or `send` for a subdomain.
   - **Type**: TXT (or CNAME if Resend says so).
   - **Value/Content**: Paste the value from Resend exactly (no extra spaces).
   - **TTL**: 3600 (or default) is fine.
5. Save the records.

### 1.4 Wait for verification

- In Resend, the domain status will change from “Pending” to **Verified** once DNS has propagated (often 5–30 minutes, sometimes up to 48 hours).
- Resend may have a **Verify** or **Check DNS** button; use it to re-check.

Once **frontierfinance.org** shows as **Verified** in Resend, you can send from `hello@frontierfinance.org`.

---

## Part 2: Configure Resend so you can use it from Supabase

Supabase sends email via SMTP. Resend provides SMTP credentials.

### 2.1 Get Resend SMTP details

1. In Resend, go to **API Keys** or **SMTP** (depending on their dashboard).
2. If there is an **SMTP** section:
   - Note **Host**, **Port**, **User**, and **Password** (or API key used as password).
3. Resend’s SMTP is often:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **User:** `resend`
   - **Password:** your **Resend API key** (from API Keys, create one if needed).

If Resend’s docs say different values, use those.

---

## Part 3: Set sender to hello@frontierfinance.org in Supabase

### 3.1 Open Auth email settings

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar: **Project Settings** (gear icon).
3. Click **Auth** (or **Authentication**).

### 3.2 SMTP settings

1. Find **SMTP Settings** (or **Custom SMTP** / **Email**).
2. **Enable** custom SMTP if it’s not already.
3. Fill in:
   - **Sender email:** `hello@frontierfinance.org`
   - **Sender name:** e.g. `Frontier Finance` or `CFF` (optional but recommended).
   - **Host:** `smtp.resend.com` (or what Resend gives).
   - **Port:** `465` or `587`.
   - **Username:** `resend` (or what Resend gives).
   - **Password:** your Resend API key.
4. Save.

### 3.3 Double-check sender

- Make sure there are no typos in **hello@frontierfinance.org**.
- Do not use a different domain (e.g. gmail.com) as sender; use only the verified domain.

---

## Part 4: Test password recovery

1. Open your app: e.g. `https://escpnetwork.net/forgot-password`.
2. Enter an email that exists in your Supabase users.
3. Submit “Send reset instructions” (or similar).
4. Check inbox (and spam) for that user. The email should be **from: hello@frontierfinance.org** and the link should work.
5. If you still get a 500, check Supabase **Logs → Auth** again; the error message will say if it’s still domain/sender related.

---

## Checklist

- [ ] Domain **frontierfinance.org** added in Resend.
- [ ] All DNS records from Resend added at your DNS provider for **frontierfinance.org**.
- [ ] Domain shows **Verified** in Resend.
- [ ] Resend SMTP details (host, port, user, API key) noted.
- [ ] In Supabase: Auth → SMTP enabled, **Sender email** = `hello@frontierfinance.org`, SMTP credentials saved.
- [ ] Password recovery tested; email received from hello@frontierfinance.org.

---

## If something fails

- **“Domain not verified” / 550:** DNS for frontierfinance.org not yet propagated or record values wrong. Re-check Resend’s exact names and values; wait up to 48 hours and verify again in Resend.
- **“Invalid credentials” in Supabase:** Use the Resend **API key** as the SMTP password and ensure host/port/user match Resend’s SMTP docs.
- **No email received:** Check spam; confirm the recipient user exists in Supabase Auth; check Supabase Auth logs for the exact error.

Using **hello@frontierfinance.org** as the sender is set entirely in **Supabase Auth SMTP** (sender email) and **Resend** (domain verification + SMTP). No code changes are required in the app.
