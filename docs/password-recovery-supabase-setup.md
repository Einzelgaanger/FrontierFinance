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
