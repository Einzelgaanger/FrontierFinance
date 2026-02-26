
-- =====================================================
-- COMPREHENSIVE COMPANY CONSOLIDATION
-- Link secondary emails as team members under primary accounts
-- =====================================================

-- 1. Actawa: primary=wiem@actawa.com, secondary=wiem.abdeljaouad@gmail.com
UPDATE user_profiles SET company_name = 'Actawa', company_id = '39c976c8-6ba7-433b-85d2-a43943062a22', user_role = 'member' WHERE id = '8b67aad6-5738-47ee-b653-c4a244ea2062';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('39c976c8-6ba7-433b-85d2-a43943062a22', '8b67aad6-5738-47ee-b653-c4a244ea2062', 'wiem.abdeljaouad@gmail.com', 'Actawa Team', '39c976c8-6ba7-433b-85d2-a43943062a22') ON CONFLICT DO NOTHING;

-- 2. Altree Capital: primary=invteam@altreecapital.com, secondary=jchamberlain@altreecapital.om
UPDATE user_profiles SET company_name = 'Altree Capital', company_id = '1929828d-3861-4fe7-a3ff-d4b137ef97d1', user_role = 'member' WHERE id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('1929828d-3861-4fe7-a3ff-d4b137ef97d1', '33c9d5fd-1a00-4979-b1db-e689da0e9f1b', 'jchamberlain@altreecapital.om', 'J Chamberlain', '1929828d-3861-4fe7-a3ff-d4b137ef97d1') ON CONFLICT DO NOTHING;

-- 3. Amam Ventures: primary=tamara@amamventures.com, secondary=jenny@amamventures.com
UPDATE user_profiles SET company_name = 'Amam Ventures', company_id = '8955a890-b367-4543-a401-d067f3797a4a', user_role = 'member' WHERE id = '19353827-4423-4705-bf33-98a5626ccace';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('8955a890-b367-4543-a401-d067f3797a4a', '19353827-4423-4705-bf33-98a5626ccace', 'jenny@amamventures.com', 'Jenny', '8955a890-b367-4543-a401-d067f3797a4a') ON CONFLICT DO NOTHING;

-- 4. Aruwa Capital Management: primary=bu@aruwacapital.com, secondary=aor@aruwacapital.com
UPDATE user_profiles SET company_name = 'Aruwa Capital Management', company_id = 'a86b4889-6c1a-4994-a3e6-11dd2554bd66', user_role = 'member' WHERE id = 'ecb33263-616d-4b9e-9c2b-0eea97cade3f';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('a86b4889-6c1a-4994-a3e6-11dd2554bd66', 'ecb33263-616d-4b9e-9c2b-0eea97cade3f', 'aor@aruwacapital.com', 'Aruwa Team', 'a86b4889-6c1a-4994-a3e6-11dd2554bd66') ON CONFLICT DO NOTHING;

-- 5. Brightmore Capital: primary=ndeye.thiaw@brightmorecapital.com, secondary=Ndeye.thiaw (case dup) + dmitry
UPDATE user_profiles SET company_name = 'Brightmore Capital', company_id = 'db19aad9-05a9-4504-bd48-65fe830ea377', user_role = 'member' WHERE id IN ('90c4a630-406f-4289-bb2e-fee309d0cbd6', 'b263d761-3317-42ac-9a24-36f0c5a3d46f');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('db19aad9-05a9-4504-bd48-65fe830ea377', '90c4a630-406f-4289-bb2e-fee309d0cbd6', 'Ndeye.thiaw@brightmorecapital.com', 'Ndeye Thiaw (alt)', 'db19aad9-05a9-4504-bd48-65fe830ea377'),
  ('db19aad9-05a9-4504-bd48-65fe830ea377', 'b263d761-3317-42ac-9a24-36f0c5a3d46f', 'dmitry.fotiyev@brightmorecapital.com', 'Dmitry Fotiyev', 'db19aad9-05a9-4504-bd48-65fe830ea377')
ON CONFLICT DO NOTHING;

-- 6. Comoé Capital: primary=a.fofana@comoecapital.com, secondary=d.doumbia + i.sidibe
UPDATE user_profiles SET company_name = 'Comoé Capital' WHERE id = 'a2fe036e-3880-4d39-9485-6590e7df3f0c';
UPDATE user_profiles SET company_name = 'Comoé Capital', company_id = 'a2fe036e-3880-4d39-9485-6590e7df3f0c', user_role = 'member' WHERE id IN ('01e00d60-3334-4001-856e-73c3928503e2', 'fd45921d-e553-4809-9c6c-adaab56dc79e');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('a2fe036e-3880-4d39-9485-6590e7df3f0c', '01e00d60-3334-4001-856e-73c3928503e2', 'd.doumbia@comoecapital.com', 'D. Doumbia', 'a2fe036e-3880-4d39-9485-6590e7df3f0c'),
  ('a2fe036e-3880-4d39-9485-6590e7df3f0c', 'fd45921d-e553-4809-9c6c-adaab56dc79e', 'i.sidibe@comoecapital.com', 'I. Sidibe', 'a2fe036e-3880-4d39-9485-6590e7df3f0c')
ON CONFLICT DO NOTHING;

-- 7. First Circle Capital: primary=selma@firstcircle.capital, secondary=agnes@firstcircle.capital
UPDATE user_profiles SET company_name = 'First Circle Capital', company_id = '328323cf-d97f-4aa7-85d4-960ec631510a', user_role = 'member' WHERE id = '0d4dbfdb-7274-4c9b-86a9-6726eef12950';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('328323cf-d97f-4aa7-85d4-960ec631510a', '0d4dbfdb-7274-4c9b-86a9-6726eef12950', 'agnes@firstcircle.capital', 'Agnes', '328323cf-d97f-4aa7-85d4-960ec631510a') ON CONFLICT DO NOTHING;

-- 8. HEVA Fund: primary=Wakiuru@hevafund.com, secondary=kendi@hevafund.com
UPDATE user_profiles SET company_name = 'HEVA Fund' WHERE id = '4de04fbf-310d-4aa5-ae02-cf4650580945';
UPDATE user_profiles SET company_name = 'HEVA Fund', company_id = '4de04fbf-310d-4aa5-ae02-cf4650580945', user_role = 'member' WHERE id = 'f86d6c5e-c252-46ff-9a45-4c064b372eca';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('4de04fbf-310d-4aa5-ae02-cf4650580945', 'f86d6c5e-c252-46ff-9a45-4c064b372eca', 'kendi@hevafund.com', 'Kendi', '4de04fbf-310d-4aa5-ae02-cf4650580945') ON CONFLICT DO NOTHING;

-- 9. Impact Capital Advisors: primary=a.annan@impcapadv.com, secondary=annan.anthony@gmail.com
UPDATE user_profiles SET company_name = 'Impact Capital Advisors', company_id = 'c38f39d6-13b5-4116-8819-7a7d21086eab', user_role = 'member' WHERE id = '7f991b2c-e7a2-4eb3-bfcb-77d217c052f9';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('c38f39d6-13b5-4116-8819-7a7d21086eab', '7f991b2c-e7a2-4eb3-bfcb-77d217c052f9', 'annan.anthony@gmail.com', 'Anthony Annan', 'c38f39d6-13b5-4116-8819-7a7d21086eab') ON CONFLICT DO NOTHING;

-- 10. Linea Capital Partners: primary=julia@lineacap.com, secondary=colin@lineacap.com
UPDATE user_profiles SET company_name = 'Linea Capital Partners' WHERE id = '3c3178d3-4580-4f1c-bd25-06a5a1f39e73';
UPDATE user_profiles SET company_name = 'Linea Capital Partners', company_id = '3c3178d3-4580-4f1c-bd25-06a5a1f39e73', user_role = 'member' WHERE id = 'bdc82c5f-2c7d-4613-9faf-8461232627bd';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('3c3178d3-4580-4f1c-bd25-06a5a1f39e73', 'bdc82c5f-2c7d-4613-9faf-8461232627bd', 'colin@lineacap.com', 'Colin', '3c3178d3-4580-4f1c-bd25-06a5a1f39e73') ON CONFLICT DO NOTHING;

-- 11. LoftyInc Capital: primary=alyune@loftyinc.vc, secondary=idris@loftyinc.vc + idris.bello@loftyincltd.biz
UPDATE user_profiles SET company_name = 'LoftyInc Capital' WHERE id = 'af146605-2884-4ee0-9e18-5c0c934e7307';
UPDATE user_profiles SET company_name = 'LoftyInc Capital', company_id = 'af146605-2884-4ee0-9e18-5c0c934e7307', user_role = 'member' WHERE id IN ('36e6551d-4557-428b-a56c-43428e99a547', 'c93782e3-8242-4079-bd02-1ac3d5ffa19d');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('af146605-2884-4ee0-9e18-5c0c934e7307', '36e6551d-4557-428b-a56c-43428e99a547', 'idris@loftyinc.vc', 'Idris', 'af146605-2884-4ee0-9e18-5c0c934e7307'),
  ('af146605-2884-4ee0-9e18-5c0c934e7307', 'c93782e3-8242-4079-bd02-1ac3d5ffa19d', 'idris.bello@loftyincltd.biz', 'Idris Bello', 'af146605-2884-4ee0-9e18-5c0c934e7307')
ON CONFLICT DO NOTHING;

-- 12. SME Impact Fund: primary=anthony@mmfm-ltd.com, secondary=allert@mmfm-ltd.com
UPDATE user_profiles SET company_name = 'SME Impact Fund' WHERE id = '5d6c3623-3958-4f3a-9799-e70ac5e7010d';
UPDATE user_profiles SET company_name = 'SME Impact Fund', company_id = '5d6c3623-3958-4f3a-9799-e70ac5e7010d', user_role = 'member' WHERE id = '2e3ac02b-123d-486a-8eb9-3c2cd90a0a45';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('5d6c3623-3958-4f3a-9799-e70ac5e7010d', '2e3ac02b-123d-486a-8eb9-3c2cd90a0a45', 'allert@mmfm-ltd.com', 'Allert', '5d6c3623-3958-4f3a-9799-e70ac5e7010d') ON CONFLICT DO NOTHING;

-- 13. Samata Capital: primary=lthomas@samatacapital.com, secondary=s.ndonga + d.rono
UPDATE user_profiles SET company_name = 'Samata Capital', company_id = '6ebf9789-7b0b-424e-ae7b-3edba255626d', user_role = 'member' WHERE id IN ('b8c2a9bf-8156-43be-83cb-0b525c84b06a', '025dbeea-df9c-41c6-ae51-dd8d8a231df7');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('6ebf9789-7b0b-424e-ae7b-3edba255626d', 'b8c2a9bf-8156-43be-83cb-0b525c84b06a', 's.ndonga@samawaticapital.com', 'S. Ndonga', '6ebf9789-7b0b-424e-ae7b-3edba255626d'),
  ('6ebf9789-7b0b-424e-ae7b-3edba255626d', '025dbeea-df9c-41c6-ae51-dd8d8a231df7', 'd.rono@samawaticapital.com', 'D. Rono', '6ebf9789-7b0b-424e-ae7b-3edba255626d')
ON CONFLICT DO NOTHING;

-- 14. Uncap: primary=esther@unconventional.capital, secondary=franziska@unconventional.capital
UPDATE user_profiles SET company_name = 'Uncap' WHERE id = 'ac3e840f-7c18-4430-823e-77718838aebd';
UPDATE user_profiles SET company_name = 'Uncap', company_id = 'ac3e840f-7c18-4430-823e-77718838aebd', user_role = 'member' WHERE id = '18a22ba3-0803-4f37-9e44-5a6034a4e0a1';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('ac3e840f-7c18-4430-823e-77718838aebd', '18a22ba3-0803-4f37-9e44-5a6034a4e0a1', 'franziska@unconventional.capital', 'Franziska', 'ac3e840f-7c18-4430-823e-77718838aebd') ON CONFLICT DO NOTHING;

-- 15. VestedWorld: primary=peter@vestedworld.com, secondary=lavanya + nneka
UPDATE user_profiles SET company_name = 'VestedWorld' WHERE id = 'd7b478f0-bd36-40c4-8b07-75ef6c235d01';
UPDATE user_profiles SET company_name = 'VestedWorld', company_id = 'd7b478f0-bd36-40c4-8b07-75ef6c235d01', user_role = 'member' WHERE id IN ('76e94ab8-401f-4323-9bee-c0ec6e809a96', '9db6845e-0379-41bb-842f-f7ae8d05b7ed');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('d7b478f0-bd36-40c4-8b07-75ef6c235d01', '76e94ab8-401f-4323-9bee-c0ec6e809a96', 'lavanya@vestedworld.com', 'Lavanya', 'd7b478f0-bd36-40c4-8b07-75ef6c235d01'),
  ('d7b478f0-bd36-40c4-8b07-75ef6c235d01', '9db6845e-0379-41bb-842f-f7ae8d05b7ed', 'nneka@vestedworld.com', 'Nneka', 'd7b478f0-bd36-40c4-8b07-75ef6c235d01')
ON CONFLICT DO NOTHING;

-- 16. ViKtoria Ventures: primary=wilfred@viktoria.co.ke, secondary=jason + stephengugu
UPDATE user_profiles SET company_name = 'ViKtoria Ventures' WHERE id = 'ef332779-1171-4d55-b0fd-c792363226dc';
UPDATE user_profiles SET company_name = 'ViKtoria Ventures', company_id = 'ef332779-1171-4d55-b0fd-c792363226dc', user_role = 'member' WHERE id IN ('a1bdf56b-3974-415a-a4b2-572e8de10f19', '82f09663-82d7-44ca-acde-2c7daf2ca31d');
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES 
  ('ef332779-1171-4d55-b0fd-c792363226dc', 'a1bdf56b-3974-415a-a4b2-572e8de10f19', 'jason@viktoria.co.ke', 'Jason', 'ef332779-1171-4d55-b0fd-c792363226dc'),
  ('ef332779-1171-4d55-b0fd-c792363226dc', '82f09663-82d7-44ca-acde-2c7daf2ca31d', 'stephengugu@viktoria.co.ke', 'Stephen Gugu', 'ef332779-1171-4d55-b0fd-c792363226dc')
ON CONFLICT DO NOTHING;

-- 17. Villgro Africa: primary=wilfred@villgroafrica.org, secondary=stawia@gmail.com
UPDATE user_profiles SET company_name = 'Villgro Africa', company_id = '96d82990-f2cc-498c-97c6-3f68048f900d', user_role = 'member' WHERE id = 'f91bcc40-279f-4828-9b4c-79456e13ee14';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('96d82990-f2cc-498c-97c6-3f68048f900d', 'f91bcc40-279f-4828-9b4c-79456e13ee14', 'stawia@gmail.com', 'Villgro Team', '96d82990-f2cc-498c-97c6-3f68048f900d') ON CONFLICT DO NOTHING;

-- 18. Wangara Green Ventures: primary=k.owusu-sarfo@wangaracapital.com, secondary=e.arthur@wangaracapital.com
UPDATE user_profiles SET company_name = 'Wangara Green Ventures' WHERE id = '903a6a48-09f5-4b39-88f5-3b86bb97345d';
UPDATE user_profiles SET company_name = 'Wangara Green Ventures', company_id = '903a6a48-09f5-4b39-88f5-3b86bb97345d', user_role = 'member' WHERE id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('903a6a48-09f5-4b39-88f5-3b86bb97345d', '42a47d5b-3e27-4bdd-a2ed-045d23151874', 'e.arthur@wangaracapital.com', 'E. Arthur', '903a6a48-09f5-4b39-88f5-3b86bb97345d') ON CONFLICT DO NOTHING;

-- 19. Africa Growth LLC: primary=tawana@africa-growth.com, secondary=tawana@afirca-growth.com (typo)
UPDATE user_profiles SET company_name = 'Africa Growth LLC', company_id = 'a5870aa8-06ff-4c0a-895c-2d3b26c6630c', user_role = 'member' WHERE id = 'bed3640e-904b-41ee-af69-544bb1e09675';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('a5870aa8-06ff-4c0a-895c-2d3b26c6630c', 'bed3640e-904b-41ee-af69-544bb1e09675', 'tawana@afirca-growth.com', 'Tawana (alt email)', 'a5870aa8-06ff-4c0a-895c-2d3b26c6630c') ON CONFLICT DO NOTHING;

-- 20. Anza Capital: primary=Audrey@anza.holdings (b03a2d08), secondary=audrey@anza.holdings (919a9736) - same person, case diff
UPDATE user_profiles SET company_name = 'Anza Capital', company_id = 'b03a2d08-ef1a-42c3-af7c-c753af768647', user_role = 'member' WHERE id = '919a9736-2655-445c-a32b-fde53d98d0d2';
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by) VALUES ('b03a2d08-ef1a-42c3-af7c-c753af768647', '919a9736-2655-445c-a32b-fde53d98d0d2', 'audrey@anza.holdings', 'Audrey (alt)', 'b03a2d08-ef1a-42c3-af7c-c753af768647') ON CONFLICT DO NOTHING;

-- 21. Normalize company names for single-email companies that had inconsistent names
UPDATE user_profiles SET company_name = 'i2i Ventures' WHERE id = '2c278626-c968-48e2-8419-25282a85a15b';
UPDATE user_profiles SET company_name = 'Renew Capital' WHERE id = '88275e63-4e66-4d8b-871b-7cf18938764a';

-- Add unique constraint to prevent duplicate member entries
ALTER TABLE company_members ADD CONSTRAINT unique_member_per_company UNIQUE (company_user_id, member_user_id);
