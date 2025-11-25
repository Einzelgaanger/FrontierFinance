// Survey question labels for each field
// This maps database field names to human-readable questions

export const survey2021Questions: Record<string, string> = {
  // Section 1: Background Information
  email_address: 'Email Address',
  firm_name: 'Organization/Firm Name',
  participant_name: 'Participant Name',
  role_title: 'Role/Title within Organization',
  team_based: 'Where is your team based?',
  team_based_other: 'Other team location',
  geographic_focus: 'Geographic Focus',
  geographic_focus_other: 'Other geographic focus',
  fund_stage: 'Fund Stage',
  fund_stage_other: 'Other fund stage',
  legal_entity_date: 'Legal Entity Established',
  first_close_date: 'First Close Achieved',
  first_investment_date: 'First Investment Made',
  
  // Section 2: Investment Thesis & Capital Construct
  investments_march_2020: 'Number of investments as of March 2020',
  investments_december_2020: 'Number of investments as of December 2020',
  optional_supplement: 'Additional investment information',
  investment_vehicle_type: 'Type of investment vehicle(s)',
  investment_vehicle_type_other: 'Other vehicle type',
  current_fund_size: 'Current Fund Size (USD)',
  target_fund_size: 'Target Fund Size (USD)',
  investment_timeframe: 'Investment Timeframe',
  investment_timeframe_other: 'Other investment timeframe',
  business_model_targeted: 'Business Model Targeted',
  business_model_targeted_other: 'Other business model',
  business_stage_targeted: 'Business Stage Targeted',
  business_stage_targeted_other: 'Other business stage',
  financing_needs: 'Type of Financing Needs You Address',
  financing_needs_other: 'Other financing needs',
  target_capital_sources: 'Target Capital Sources',
  target_capital_sources_other: 'Other capital sources',
  target_irr_achieved: 'IRR Achieved to Date',
  target_irr_targeted: 'Target IRR',
  impact_vs_financial_orientation: 'Impact vs Financial Returns Orientation',
  impact_vs_financial_orientation_other: 'Other orientation',
  explicit_lens_focus: 'Explicit Investment Lens',
  explicit_lens_focus_other: 'Other investment lens',
  report_sustainable_development_goals: 'Do you report on Sustainable Development Goals?',
  top_sdg_1: 'Top SDG #1',
  top_sdg_2: 'Top SDG #2',
  top_sdg_3: 'Top SDG #3',
  top_sdgs: 'Top SDGs',
  other_sdgs: 'Other SDGs',
  gender_considerations_investment: 'Gender Considerations in Investment Decisions',
  gender_considerations_investment_other: 'Other gender considerations (investment)',
  gender_considerations_requirement: 'Gender Requirements for Portfolio Companies',
  gender_considerations_requirement_other: 'Other gender requirements',
  gender_fund_vehicle: 'Gender-Focused Fund/Vehicle',
  gender_fund_vehicle_other: 'Other gender fund vehicle',
  
  // Section 3: Portfolio Construction and Team
  investment_size_your_amount: 'Your Investment Size',
  investment_size_total_raise: 'Total Raise Amount',
  investment_forms: 'Forms of Investment',
  investment_forms_other: 'Other investment forms',
  target_sectors: 'Target Sectors',
  target_sectors_other: 'Other sectors',
  carried_interest_principals: 'Number of Managing Principals/Partners',
  current_ftes: 'Current Full-Time Equivalents (FTEs)',
  
  // Section 4: Portfolio Development & Investment Return Monetization
  portfolio_needs_ranking: 'Portfolio Company Needs (Ranked)',
  portfolio_needs_other: 'Other portfolio needs',
  investment_monetization: 'Investment Return Monetization',
  investment_monetization_other: 'Other monetization methods',
  exits_achieved: 'Number of Exits Achieved',
  exits_achieved_other: 'Exit details',
  fund_capabilities_ranking: 'Fund Capabilities (Ranked)',
  fund_capabilities_other: 'Other fund capabilities',
  
  // Section 5: Impact of COVID-19 on Vehicle and Portfolio
  covid_impact_aggregate: 'Overall COVID-19 Impact on Fund',
  covid_impact_portfolio: 'COVID-19 Impact on Portfolio Companies',
  covid_government_support: 'Government Support Received',
  covid_government_support_other: 'Other government support',
  raising_capital_2021: 'Raising Capital in 2021',
  raising_capital_2021_other: 'Other capital raising',
  fund_vehicle_considerations: 'Fund Vehicle Considerations',
  fund_vehicle_considerations_other: 'Other considerations',
  
  // Section 6: Feedback on ESCP Network Membership
  network_value_rating: 'How valuable is the ESCP Network?',
  working_groups_ranking: 'Working Groups Interest (Ranked)',
  new_working_group_suggestions: 'New Working Group Suggestions',
  webinar_content_ranking: 'Webinar Topics Interest (Ranked)',
  new_webinar_suggestions: 'New Webinar Suggestions',
  communication_platform: 'Preferred Communication Platform',
  communication_platform_other: 'Other platform',
  network_value_areas: 'Network Value Areas (Ranked)',
  present_connection_session: 'Interest in Presenting at Connection Session',
  present_connection_session_other: 'Connection session details',
  convening_initiatives_ranking: 'Convening Initiatives Interest (Ranked)',
  convening_initiatives_other: 'Other convening initiatives',
  
  // Section 7: 2021 Convening Objectives & Goals
  participate_mentoring_program: 'Interested in Mentoring Program?',
  participate_mentoring_program_other: 'Mentoring details',
  present_demystifying_session: 'Topics for Demystifying Session',
  present_demystifying_session_other: 'Other session topics',
  additional_comments: 'Additional Comments'
};

export const survey2022Questions: Record<string, string> = {
  // Section 1: Background Information
  name: 'Name',
  role_title: 'Role/Title',
  email: 'Email Address',
  organisation: 'Organization Name',
  legal_entity_date: 'Legal Entity Established',
  first_close_date: 'First Close Achieved',
  first_investment_date: 'First Investment Made',
  
  // Section 2: Geographic Markets and Team
  geographic_markets: 'Geographic Markets',
  geographic_markets_other: 'Other markets',
  team_based: 'Team Locations',
  team_based_other: 'Other team locations',
  current_ftes: 'Current FTEs',
  ye2023_ftes: 'Year-End 2023 FTEs',
  principals_count: 'Number of Managing Principals/Partners',
  gp_experience: 'GP Experience by Category',
  gp_experience_other_description: 'Other GP experience',
  gender_orientation: 'Gender Orientation of Team',
  gender_orientation_other: 'Other gender orientation',
  investments_experience: 'Team Investment Experience',
  exits_experience: 'Team Exit Experience',
  
  // Section 3: Vehicle Construct and Fundraising
  legal_domicile: 'Legal Domicile',
  legal_domicile_other: 'Other domicile',
  currency_investments: 'Currency for Investments',
  currency_lp_commitments: 'Currency for LP Commitments',
  fund_operations: 'Fund Operations Status',
  fund_operations_other: 'Other operations status',
  current_funds_raised: 'Current Funds Raised (USD)',
  current_amount_invested: 'Current Amount Invested (USD)',
  target_fund_size: 'Target Fund Size (USD)',
  target_investments: 'Target Number of Investments',
  follow_on_permitted: 'Follow-On Investment Permitted?',
  target_irr: 'Target IRR',
  target_irr_other: 'Other IRR details',
  concessionary_capital: 'Concessionary Capital',
  concessionary_capital_other: 'Other concessionary capital',
  lp_capital_sources: 'LP Capital Sources',
  lp_capital_sources_other_description: 'Other LP sources',
  gp_commitment: 'GP Commitment Form',
  management_fee: 'Management Fee',
  management_fee_other: 'Other management fee',
  carried_interest_hurdle: 'Carried Interest/Hurdle Rate',
  carried_interest_hurdle_other: 'Other hurdle rate',
  fundraising_constraints: 'Fundraising Constraints (Ranked)',
  fundraising_constraints_other_description: 'Other constraints',
  
  // Section 4: Investment Thesis and Strategy
  investment_stage: 'Investment Stage',
  investment_type: 'Investment Type',
  investment_size: 'Investment Size',
  business_stages: 'Business Stages Targeted (%)',
  business_stages_other_description: 'Other business stages',
  enterprise_types: 'Enterprise Types',
  financing_needs: 'Financing Needs (%)',
  financing_needs_other_description: 'Other financing needs',
  sector_activities: 'Sector Activities Allocation',
  sector_activities_other_description: 'Other sectors',
  sector_focus: 'Primary Sector Focus',
  geographic_focus: 'Geographic Focus',
  financial_instruments: 'Financial Instruments Used (%)',
  financial_instruments_other_description: 'Other instruments',
  sdg_targets: 'SDG Targets',
  gender_lens_investing: 'Gender Lens Investing Approach',
  gender_lens_investing_other_description: 'Other gender approach',
  technology_role_investment_thesis: 'Role of Technology in Investment Thesis',
  
  // Section 5: Portfolio Development and Value Creation
  pipeline_sourcing: 'Pipeline Sourcing Channels',
  pipeline_sourcing_other_description: 'Other sourcing channels',
  average_investment_size_per_company: 'Average Investment Size per Company',
  portfolio_value_creation_priorities: 'Portfolio Value Creation Priorities',
  portfolio_value_creation_other_description: 'Other value creation',
  value_add_services: 'Value-Add Services',
  typical_investment_timeframe: 'Typical Investment Timeframe',
  investment_monetization_exit_forms: 'Investment Monetization/Exit Forms',
  investment_monetization_exit_forms_other: 'Other exit forms',
  
  // Section 6: Portfolio Performance and Exits
  equity_exits_achieved: 'Equity Exits Achieved',
  debt_repayments_achieved: 'Debt Repayments Achieved',
  investments_made_to_date: 'Total Investments Made to Date',
  other_investments_supplement: 'Additional Investment Information',
  anticipated_exits_12_months: 'Anticipated Exits in Next 12 Months',
  revenue_growth_recent_12_months: 'Portfolio Revenue Growth (Recent 12 Months, %)',
  cash_flow_growth_recent_12_months: 'Portfolio Cash Flow Growth (Recent 12 Months, %)',
  revenue_growth_next_12_months: 'Expected Revenue Growth (Next 12 Months, %)',
  cash_flow_growth_next_12_months: 'Expected Cash Flow Growth (Next 12 Months, %)',
  portfolio_performance_other_description: 'Other performance metrics',
  
  // Section 7: Jobs Impact
  direct_jobs_created_cumulative: 'Direct Jobs Created (Cumulative)',
  direct_jobs_anticipated_change: 'Direct Jobs Anticipated Change',
  indirect_jobs_created_cumulative: 'Indirect Jobs Created (Cumulative)',
  indirect_jobs_anticipated_change: 'Indirect Jobs Anticipated Change',
  jobs_impact_other_description: 'Other jobs impact',
  
  // Section 8: Fund Priorities and Concerns
  fund_priority_areas: 'Fund Priority Areas',
  fund_priority_areas_other_description: 'Other priorities',
  domestic_factors_concerns: 'Domestic Factors/Concerns',
  domestic_factors_concerns_other_description: 'Other domestic concerns',
  international_factors_concerns: 'International Factors/Concerns',
  international_factors_concerns_other_description: 'Other international concerns',
  receive_results: 'Receive Survey Results?'
};

export const survey2023Questions: Record<string, string> = {
  // Section 1: Introduction & Context
  email_address: 'Email Address',
  organisation_name: 'Organization Name',
  funds_raising_investing: 'Are you currently raising or investing funds?',
  fund_name: 'Fund Name',
  
  // Section 2: Organizational Background and Team
  legal_entity_achieved: 'Legal Entity Achieved',
  first_close_achieved: 'First Close Achieved',
  first_investment_achieved: 'First Investment Achieved',
  geographic_markets: 'Geographic Markets',
  geographic_markets_other: 'Other markets',
  team_based: 'Team Locations',
  team_based_other: 'Other team locations',
  fte_staff_2022: 'FTE Staff (Year-End 2022)',
  fte_staff_current: 'FTE Staff (Current)',
  fte_staff_2024_est: 'FTE Staff (2024 Estimate)',
  principals_count: 'Number of Managing Principals/Partners',
  gender_inclusion: 'Gender Inclusion in Team',
  gender_inclusion_other: 'Other gender inclusion',
  team_experience_investments: 'Team Experience - Investments',
  team_experience_exits: 'Team Experience - Exits',
  team_experience_other: 'Other team experience',
  
  // Section 3: Vehicle Construct
  legal_domicile: 'Legal Domicile',
  legal_domicile_other: 'Other domicile',
  currency_investments: 'Currency for Investments',
  currency_lp_commitments: 'Currency for LP Commitments',
  fund_type_status: 'Fund Type/Status',
  fund_type_status_other: 'Other fund type',
  current_funds_raised: 'Current Funds Raised (USD)',
  current_amount_invested: 'Current Amount Invested (USD)',
  target_fund_size: 'Target Fund Size (USD)',
  target_investments_count: 'Target Number of Investments',
  follow_on_investment_permitted: 'Follow-On Investment Permitted?',
  concessionary_capital: 'Concessionary Capital Sources',
  concessionary_capital_other: 'Other concessionary capital',
  lp_capital_sources_existing: 'Existing LP Capital Sources (%)',
  lp_capital_sources_target: 'Target LP Capital Sources (%)',
  gp_financial_commitment: 'GP Financial Commitment',
  gp_financial_commitment_other: 'Other GP commitment',
  gp_management_fee: 'GP Management Fee',
  gp_management_fee_other: 'Other management fee',
  hurdle_rate_currency: 'Hurdle Rate Currency',
  hurdle_rate_currency_other: 'Other currency',
  hurdle_rate_percentage: 'Hurdle Rate (%)',
  target_local_currency_return_methods: 'Target Local Currency Return Methods',
  target_local_currency_return: 'Target Local Currency Return (%)',
  fundraising_constraints: 'Fundraising Constraints (Ranked)',
  fundraising_constraints_other: 'Other constraints',
  
  // Section 4: Investment Thesis
  business_stages: 'Business Stages Targeted (%)',
  growth_expectations: 'Growth Expectations (%)',
  financing_needs: 'Financing Needs (%)',
  sector_focus: 'Sector Focus (%)',
  sector_focus_other: 'Other sectors',
  financial_instruments: 'Financial Instruments Used (%)',
  sustainable_development_goals: 'Sustainable Development Goals',
  sdg_ranking: 'SDG Ranking',
  gender_lens_investing: 'Gender Lens Investing Approach',
  gender_lens_investing_other: 'Other gender approach',
  
  // Section 5: Pipeline Sourcing and Portfolio Construction
  pipeline_sourcing: 'Pipeline Sourcing Channels (%)',
  pipeline_sourcing_other: 'Other sourcing',
  average_investment_size: 'Average Investment Size',
  average_investment_size_per_company: 'Average Investment Size per Company',
  capital_raise_percentage: 'Capital Raised (% of Target)',
  portfolio_funding_mix: 'Portfolio Funding Mix (%)',
  portfolio_funding_mix_other: 'Other funding',
  
  // Section 6: Portfolio Value Creation and Exits
  portfolio_priorities: 'Portfolio Priorities (Ranked)',
  portfolio_priorities_other: 'Other priorities',
  portfolio_value_creation_priorities: 'Value Creation Priorities',
  portfolio_value_creation_other: 'Other value creation',
  technical_assistance_funding: 'Technical Assistance Funding (%)',
  technical_assistance_funding_other: 'Other TA funding',
  business_development_approach: 'Business Development Approach',
  business_development_approach_other: 'Other BD approach',
  business_development_support: 'Business Development Support',
  business_development_support_other: 'Other BD support',
  investment_timeframe: 'Typical Investment Timeframe',
  exit_form: 'Exit Forms',
  exit_form_other: 'Other exit forms',
  
  // Section 7: Performance to Date and Current Outlook
  equity_exits_anticipated: 'Equity Exits Anticipated (Next 12 Months)',
  debt_exits_anticipated: 'Debt Repayments Anticipated (Next 12 Months)',
  other_investments_description: 'Other Investments Description',
  other_investments: 'Other Investments',
  portfolio_performance: 'Portfolio Performance Metrics',
  portfolio_performance_other_description: 'Other performance',
  jobs_impact: 'Jobs Impact',
  jobs_impact_historical_direct: 'Direct Jobs Created (Historical)',
  jobs_impact_historical_indirect: 'Indirect Jobs Created (Historical)',
  jobs_impact_expected_direct: 'Direct Jobs Expected',
  jobs_impact_expected_indirect: 'Indirect Jobs Expected',
  jobs_impact_historical_other: 'Other historical jobs',
  jobs_impact_expected_other: 'Other expected jobs',
  jobs_impact_other_description: 'Other jobs impact',
  fund_priorities: 'Fund Priorities (Ranked)',
  fund_priorities_other_description: 'Other priorities',
  revenue_growth_historical: 'Revenue Growth (Historical, %)',
  revenue_growth_expected: 'Revenue Growth (Expected, %)',
  cash_flow_growth_historical: 'Cash Flow Growth (Historical, %)',
  cash_flow_growth_expected: 'Cash Flow Growth (Expected, %)',
  concerns_ranking: 'Concerns (Ranked)',
  concerns_ranking_other: 'Other concerns',
  future_research_data: 'Interest in Future Research Data',
  future_research_data_other: 'Other research data',
  one_on_one_meeting: 'Interest in One-on-One Meeting',
  receive_survey_results: 'Receive Survey Results?'
};

export const survey2024Questions: Record<string, string> = {
  // Section 1: Introduction & Context
  email_address: 'Email Address',
  investment_networks: 'Investment Networks You Belong To',
  investment_networks_other: 'Other networks',
  organisation_name: 'Organization Name',
  funds_raising_investing: 'Are you currently raising or investing funds?',
  fund_name: 'Fund Name',
  
  // Section 2: Organizational Background and Team
  legal_entity_achieved: 'Legal Entity Achieved',
  first_close_achieved: 'First Close Achieved',
  first_investment_achieved: 'First Investment Achieved',
  geographic_markets: 'Geographic Markets',
  geographic_markets_other: 'Other markets',
  team_based: 'Team Locations',
  team_based_other: 'Other team locations',
  fte_staff_2023_actual: 'FTE Staff (2023 Actual)',
  fte_staff_current: 'FTE Staff (Current)',
  fte_staff_2025_forecast: 'FTE Staff (2025 Forecast)',
  investment_approval: 'Investment Approval Process',
  investment_approval_other: 'Other approval process',
  principals_total: 'Total Number of Principals',
  principals_women: 'Number of Women Principals',
  gender_inclusion: 'Gender Inclusion Practices',
  gender_inclusion_other: 'Other gender inclusion',
  team_experience_investments: 'Team Experience - Investments',
  team_experience_exits: 'Team Experience - Exits',
  
  // Section 3: Vehicle Construct
  legal_domicile: 'Legal Domicile',
  legal_domicile_other: 'Other domicile',
  domicile_reason: 'Reasons for Domicile Choice',
  domicile_reason_other: 'Other reasons',
  regulatory_impact: 'Regulatory Impact Assessment',
  regulatory_impact_other: 'Other regulatory impact',
  currency_investments: 'Currency for Investments',
  currency_lp_commitments: 'Currency for LP Commitments',
  currency_hedging_strategy: 'Currency Hedging Strategy',
  currency_hedging_details: 'Currency Hedging Details',
  fund_type_status: 'Fund Type/Status',
  fund_type_status_other: 'Other fund type',
  hard_commitments_2022: 'Hard Commitments (2022, USD)',
  hard_commitments_current: 'Hard Commitments (Current, USD)',
  amount_invested_2022: 'Amount Invested (2022, USD)',
  amount_invested_current: 'Amount Invested (Current, USD)',
  target_fund_size_2022: 'Target Fund Size (2022, USD)',
  target_fund_size_current: 'Target Fund Size (Current, USD)',
  target_number_investments: 'Target Number of Investments',
  follow_on_permitted: 'Follow-On Investment Permitted?',
  concessionary_capital: 'Concessionary Capital Sources',
  concessionary_capital_other: 'Other concessionary capital',
  existing_lp_sources: 'Existing LP Sources',
  existing_lp_sources_other_description: 'Other existing LP sources',
  target_lp_sources: 'Target LP Sources',
  target_lp_sources_other_description: 'Other target LP sources',
  gp_financial_commitment: 'GP Financial Commitment',
  gp_financial_commitment_other: 'Other GP commitment',
  gp_management_fee: 'GP Management Fee',
  gp_management_fee_other: 'Other management fee',
  hurdle_rate_currency: 'Hurdle Rate Currency',
  hurdle_rate_currency_other: 'Other currency',
  hurdle_rate_percentage: 'Hurdle Rate (%)',
  target_return_above_govt_debt: 'Target Return Above Government Debt (%)',
  fundraising_barriers: 'Fundraising Barriers',
  fundraising_barriers_other_description: 'Other barriers',
  
  // Section 4: Investment Thesis
  business_stages: 'Business Stages Targeted (%)',
  revenue_growth_mix: 'Revenue Growth Mix (%)',
  financing_needs: 'Financing Needs (%)',
  sector_target_allocation: 'Sector Target Allocation',
  investment_considerations: 'Investment Considerations',
  investment_considerations_other: 'Other considerations',
  financial_instruments_ranking: 'Financial Instruments Ranking',
  top_sdgs: 'Top SDGs',
  additional_sdgs: 'Additional SDGs',
  gender_lens_investing: 'Gender Lens Investing Approach',
  
  // Section 5: Pipeline Sourcing and Portfolio Construction
  pipeline_sources_quality: 'Pipeline Sources Quality Assessment',
  pipeline_sources_quality_other_description: 'Other pipeline sources',
  pipeline_sources_quality_other_score: 'Other source score',
  sgb_financing_trends: 'Small & Growing Business Financing Trends',
  typical_investment_size: 'Typical Investment Size',
  
  // Section 6: Portfolio Value Creation and Exits
  post_investment_priorities: 'Post-Investment Priorities',
  post_investment_priorities_other_description: 'Other priorities',
  post_investment_priorities_other_score: 'Other priority score',
  technical_assistance_funding: 'Technical Assistance Funding (%)',
  business_development_approach: 'Business Development Approach',
  business_development_approach_other: 'Other BD approach',
  unique_offerings: 'Unique Offerings to Portfolio Companies',
  unique_offerings_other_description: 'Other unique offerings',
  unique_offerings_other_score: 'Other offering score',
  typical_investment_timeframe: 'Typical Investment Timeframe',
  investment_monetisation_forms: 'Investment Monetisation Forms',
  investment_monetisation_other: 'Other monetisation',
  
  // Section 7: Performance to Date and Current Outlook
  equity_investments_made: 'Equity Investments Made',
  debt_investments_made: 'Debt Investments Made',
  equity_exits_achieved: 'Equity Exits Achieved',
  debt_repayments_achieved: 'Debt Repayments Achieved',
  equity_exits_anticipated: 'Equity Exits Anticipated',
  debt_repayments_anticipated: 'Debt Repayments Anticipated',
  other_investments_supplement: 'Additional Investment Information',
  portfolio_revenue_growth_12m: 'Portfolio Revenue Growth (Last 12 Months)',
  portfolio_revenue_growth_next_12m: 'Portfolio Revenue Growth (Next 12 Months)',
  portfolio_cashflow_growth_12m: 'Portfolio Cash Flow Growth (Last 12 Months)',
  portfolio_cashflow_growth_next_12m: 'Portfolio Cash Flow Growth (Next 12 Months)',
  portfolio_performance_other_description: 'Other performance metrics',
  portfolio_performance_other_category: 'Other performance category',
  portfolio_performance_other_value: 'Other performance value',
  direct_jobs_current: 'Direct Jobs (Current)',
  indirect_jobs_current: 'Indirect Jobs (Current)',
  direct_jobs_anticipated: 'Direct Jobs Anticipated',
  indirect_jobs_anticipated: 'Indirect Jobs Anticipated',
  employment_impact_other_description: 'Other employment impact',
  employment_impact_other_category: 'Other employment category',
  employment_impact_other_value: 'Other employment value',
  fund_priorities_next_12m: 'Fund Priorities (Next 12 Months)',
  fund_priorities_other_description: 'Other priorities',
  fund_priorities_other_category: 'Other priority category',
  data_sharing_willingness: 'Data Sharing Willingness',
  data_sharing_other: 'Other data sharing',
  survey_sender: 'Survey Sent By',
  receive_results: 'Receive Survey Results?'
};

// Get question label for a specific field and year
export const getQuestionLabel = (fieldName: string, year: number): string => {
  let questionMap: Record<string, string> = {};
  
  switch (year) {
    case 2021:
      questionMap = survey2021Questions;
      break;
    case 2022:
      questionMap = survey2022Questions;
      break;
    case 2023:
      questionMap = survey2023Questions;
      break;
    case 2024:
      questionMap = survey2024Questions;
      break;
    default:
      return formatFieldName(fieldName);
  }
  
  return questionMap[fieldName] || formatFieldName(fieldName);
};

// Fallback formatting function
function formatFieldName(field: string): string {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
