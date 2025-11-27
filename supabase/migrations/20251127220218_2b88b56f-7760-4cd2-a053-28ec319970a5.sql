-- Insert 100 test submissions using CASE for array selection
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO launch_plus_assessments (
      full_name, email, phone_whatsapp, fund_name, fund_website, 
      linkedin_profile, address, fund_stages, stage_explanation,
      interested_services, geographical_focus, legal_status,
      operations_vs_domicile, capital_raised_grants, capital_raised_first_loss,
      capital_raised_equity, capital_raised_debt, capital_raised_senior,
      investments_count, capital_committed, capital_disbursed, program_expectations
    ) VALUES (
      'Test Manager ' || i,
      'testmanager' || i || '@example.com',
      '+2547' || LPAD(i::text, 8, '0'),
      'Fund ' || i || ' Capital Partners',
      'https://fund' || i || '.example.com',
      'https://linkedin.com/in/testmanager' || i,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Nairobi, Kenya'
        WHEN 1 THEN 'Lagos, Nigeria'
        WHEN 2 THEN 'Accra, Ghana'
        WHEN 3 THEN 'Dakar, Senegal'
        ELSE 'Kigali, Rwanda'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN ARRAY['Concept']
        WHEN 1 THEN ARRAY['Pilot']
        WHEN 2 THEN ARRAY['Implementation']
        WHEN 3 THEN ARRAY['Scale']
        ELSE ARRAY['Pilot', 'Implementation']
      END,
      'Our fund is at an exciting stage with strong local partnerships and a clear investment thesis.',
      CASE MOD(i, 4)
        WHEN 0 THEN ARRAY['Shared back-office services', 'Fund administration']
        WHEN 1 THEN ARRAY['Capacity building/TA support', 'Op-ex financing']
        WHEN 2 THEN ARRAY['Warehousing lines of credit']
        ELSE ARRAY['Shared back-office services', 'Capacity building/TA support']
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN ARRAY['East Africa']
        WHEN 1 THEN ARRAY['West Africa']
        WHEN 2 THEN ARRAY['Southern Africa']
        WHEN 3 THEN ARRAY['East Africa', 'West Africa']
        ELSE ARRAY['Pan-African']
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Limited Partnership'
        WHEN 1 THEN 'Limited Liability Company'
        WHEN 2 THEN 'Trust'
        WHEN 3 THEN 'Variable Capital Company'
        ELSE 'Not yet established'
      END,
      CASE MOD(i, 3)
        WHEN 0 THEN 'Same country'
        WHEN 1 THEN 'Different countries - ops in Africa, domiciled in Africa'
        ELSE 'Different countries - ops in Africa, domiciled outside Africa'
      END,
      50000 + (i * 5000),
      25000 + (i * 2500),
      100000 + (i * 10000),
      75000 + (i * 7500),
      50000 + (i * 5000),
      3 + MOD(i, 15),
      500000 + (i * 50000),
      250000 + (i * 25000),
      'We are seeking Launch+ support to strengthen our operations and accelerate our impact. Our fund focuses on early-stage businesses across Africa with a strong emphasis on local job creation and sustainable growth.'
    );
  END LOOP;
END $$;