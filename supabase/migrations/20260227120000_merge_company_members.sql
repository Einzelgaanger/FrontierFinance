-- Merge: link secondary accounts to primary company accounts (company_members)
-- Source: docs/merge-confirmation-email-and-companies.md
-- Only inserts where both primary and secondary exist in user_profiles and primary != secondary.
-- ON CONFLICT DO NOTHING so existing links are left as-is.

-- Helper: insert one link (primary_email, secondary_email). Uses LOWER(TRIM(email)) for matching.
INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('lelemba@atgsamata.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('Lisa@atgsamata.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('ik@atlanticaventures.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('aniko@atlanticaventures.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('innocent@anzaentrepreneurs.co.tz')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('Audrey@anza.holdings')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('bu@aruwacapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('aor@aruwacapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('dmitry.fotiyev@brightmorecapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('ndeye.thiaw@brightmorecapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('i.sidibe@comoecapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('d.doumbia@comoecapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('a.fofana@comoecapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('d.doumbia@comoecapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('agnes@firstcircle.capital')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('selma@firstcircle.capital')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('finance@habacapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('teddy.onserio@habacapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('kendi@hevafund.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('Wakiuru@hevafund.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('annan.anthony@gmail.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('a.annan@impcapadv.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('julia@lineacap.compital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('julia@lineacap.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('colin@lineacap.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('julia@lineacap.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('alyune@loftyinc.vc')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('idris.bello@loftyincltd.biz')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('idris@loftyinc.vc')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('idris.bello@loftyincltd.biz')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('e.ravohitrarivo@miarakap.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('e.cotsoyannis@miarakap.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('sam@mirepaadvisors.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('enyonam@mirepaadvisors.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('enyonam@mirepacapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('enyonam@mirepaadvisors.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('david.wangolo@pearlcapital.net')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('funmiadepoju@gmail.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('o.adepoju@pearlbridgecapital.africa')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('funmiadepoju@gmail.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('anthony@mmfm-ltd.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('allert@mmfm-ltd.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('william.prothais@uberiscapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('sov.leang@uberiscapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('esther@unconventional.capital')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('franziska@unconventional.capital')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('Nkhulu@torhotech.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('franziska@unconventional.capital')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('peter@vestedworld.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('nneka@vestedworld.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('lavanya@vestedworld.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('nneka@vestedworld.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('wilfred@viktoria.co.ke')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('stephengugu@viktoria.co.ke')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('jason@viktoria.co.ke')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('stephengugu@viktoria.co.ke')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('stawia@gmail.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('wilfred@villgroafrica.org')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('k.owusu-sarfo@wangaracapital.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('e.arthur@wangaracapital.com')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;

INSERT INTO public.company_members (company_user_id, member_user_id, member_email)
SELECT p.id, s.id, s.email
FROM (SELECT id, email FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('yvonne@womencapital.co.com')) LIMIT 1) s,
     (SELECT id FROM public.user_profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM('nyeji@womencapital.co')) LIMIT 1) p
WHERE p.id IS NOT NULL AND s.id IS NOT NULL AND p.id != s.id
ON CONFLICT (member_user_id) DO NOTHING;
