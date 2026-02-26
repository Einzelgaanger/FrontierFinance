# Password recovery 500 – Supabase

## Your current error (Resend + domain verification)

The log shows:

```text
550 The gmail.com domain is not verified. Please, add and verify your domain on https://resend.com/domains
```

So **Resend** (your SMTP provider) is rejecting the email because the **sender address** you use in Supabase is either:

- An address **@gmail.com** (you cannot verify gmail.com in Resend), or  
- An address on a **custom domain** that is not yet verified in Resend.

**Fix:**

1. **In Resend** ([resend.com/domains](https://resend.com/domains)):
   - Add your **own domain** (e.g. `frontierfinance.org` or `escpnetwork.net`).
   - Add the DNS records Resend shows (SPF, DKIM, etc.) at your DNS provider.
   - Wait until the domain shows as **Verified**.

2. **In Supabase** (Project Settings → Auth → SMTP / “Sender email”):
   - Set the **sender email** to an address on that verified domain, e.g.:
     - `noreply@frontierfinance.org`, or  
     - `auth@escpnetwork.net`
   - Do **not** use `@gmail.com` as the sender (Resend will not allow it).

After the domain is verified in Resend and the sender in Supabase uses that domain, recovery emails should send and the 500 should stop.

---

## Other causes (if redirect URL was the issue or for reference)

## 1. Check Auth logs (find the real error)

1. **Supabase Dashboard** → **Logs** → **Auth** (or **Logs** → filter by “Auth”).
2. Trigger “Forgot password” again from the app.
3. Look at the log entry for the recover request and note the **error message** (e.g. “Failed to send email”, SMTP error, hook error).

That message will tell you whether the 500 is from email delivery, an Auth Hook, or something else.

## 2. Email / SMTP (most likely when redirect URL is correct)

Supabase’s **built-in email** can fail in production (rate limits, deliverability, or temporary issues), which often shows up as a 500 on recover.

- Go to **Project Settings** → **Auth** (or **Authentication** → **SMTP**).
- **Option A – Custom SMTP (recommended for production)**  
  Configure your own SMTP (e.g. Resend, SendGrid, Mailgun, or your provider). Once SMTP is set and enabled, Supabase uses it for all auth emails (including password reset). This usually fixes 500s caused by email sending.
- **Option B – Stay on default**  
  If you don’t use custom SMTP, check [Supabase Status](https://status.supabase.com), wait a bit, and try again. If the Auth log shows an email/sending error, setting up custom SMTP is the reliable fix.

## 3. Auth Hook (if you use one)

If you have an **Auth Hook** (Supabase Dashboard → **Authentication** → **Hooks**):

- Temporarily disable the hook and try “Forgot password” again.
- If the 500 goes away, the hook is failing (e.g. throws or returns an error). Fix or adjust the hook so it doesn’t break the recover flow.

## 4. Redirect URL and Site URL (for completeness)

- **Redirect URLs**: Must include `https://escpnetwork.net/reset-password` (you already have this).
- **Site URL**: Set to `https://escpnetwork.net` so the link in the email points to your app.

## 5. Rate limiting

Sending many reset requests in a short time can cause throttling or errors. Wait a few minutes and try again with a single email.

---

**Summary:** With the redirect URL already allowed, the next step is **Auth logs** to see the exact error, then **custom SMTP** if the logs show an email/sending failure. That combination resolves most 500s on recover.

---

## No emails at all (any address, including different emails)

If **no** reset emails are sent for any address (and you see 429 rate limit or no error but nothing in Resend/inbox), work through this list.

### 1. Auth logs (required)

1. **Supabase Dashboard** → **Logs** → **Auth**.
2. Trigger “Forgot password” once from the app (one email).
3. Check the log for that request:
   - **429 / “email rate limit exceeded”** → See step 2 (rate limits).
   - **500 / “Failed to send” / SMTP or hook error** → See steps 3–4 (SMTP or Hook).
   - **200 / success** but no email → Likely SMTP or Hook sends then fails; still check steps 3–4.

### 2. Rate limits (429 for everyone)

Supabase Auth applies **global** rate limits on auth emails (signup + recover + magic link), not only per-address. So after a few attempts in a short time, **all** addresses can get 429 until the window resets.

- **Dashboard:** **Authentication** → **Rate Limits** (or **Settings** → **Auth**). Check “Email” / “Recovery” limits.
- **Action:** Wait **at least 1 hour** without requesting any reset, then try **one** request. If it still 429s, increase the recovery limit if your plan allows, or wait longer.

### 3. Custom SMTP (if you are **not** using a Send Email Hook)

If **Authentication** → **Hooks** does **not** have a “Send Email” hook enabled:

- **Authentication** → **SMTP** (or **Project Settings** → **Auth** → **SMTP**).
- Ensure **Enable Custom SMTP** is on.
- **Sender email:** use a verified domain (e.g. `hello@frontierfinance.org`). Not @gmail.com.
- **Host / port / user / password:** match Resend’s SMTP (e.g. host `smtp.resend.com`, port 465, user `resend`, password = Resend API key).
- In **Resend** → **Domains**, the sender’s domain must be **Verified** (DNS for that domain added and green).

If SMTP is wrong or domain not verified, Supabase may “accept” the request but the email never reaches Resend or the inbox.

### 4. Send Email Hook (if you **are** using the `send-auth-email` Edge Function)

If **Authentication** → **Hooks** has a **Send Email** hook pointing to your Edge Function:

- **Hook URL** must be the deployed function URL (e.g. `https://qiqxdivyyjcbegdlptuq.supabase.co/functions/v1/send-auth-email`).
- **Hook secret** must match the `SEND_EMAIL_HOOK_SECRET` secret set for the function.
- The function needs **RESEND_API_KEY** (and optionally **RESEND_FROM_EMAIL**, e.g. `CFF Network <hello@frontierfinance.org>`) in **Project Settings** → **Edge Functions** → **Secrets**.
- In **Resend** → **Domains**, the address in `RESEND_FROM_EMAIL` must use a **Verified** domain (e.g. `frontierfinance.org`). If you leave the default `onboarding@resend.dev`, some receivers may block or drop it.

If the hook returns an error or times out, Supabase may surface that in Auth logs; fix the hook (secret, Resend key, from address) so it returns 200.

### 5. One path only: Hook **or** SMTP

- If the **Send Email Hook** is **enabled**, Supabase uses **only** the hook (SMTP is ignored).
- If the hook is **disabled**, Supabase uses **only** SMTP.

So: either fix the hook (and its from-address/Resend config), or disable the hook and fix SMTP. Don’t assume both are in use at once.

---

**Summary:** Check **Auth logs** first. Then fix **rate limits** (wait or adjust), and either **SMTP** or **Send Email Hook** (and Resend domain/from address) so that one path is correct end-to-end.
