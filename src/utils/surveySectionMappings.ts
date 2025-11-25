// Survey section mappings for each year
// This defines which fields belong to which sections for each survey year

export interface SurveySection {
  id: number;
  title: string;
  fields: string[];
}

// 2021 Survey Sections
export const survey2021Sections: SurveySection[] = [
  {
    id: 1,
    title: 'Background Information',
    fields: [
      'email_address', 'firm_name', 'participant_name', 'role_title',
      'team_based', 'team_based_other', 'geographic_focus', 'geographic_focus_other',
      'fund_stage', 'fund_stage_other', 'legal_entity_date', 'first_close_date', 'first_investment_date'
    ]
  },
  {
    id: 2,
    title: 'Investment Thesis & Capital Construct',
    fields: [
      'investments_march_2020', 'investments_december_2020', 'optional_supplement',
      'investment_vehicle_type', 'investment_vehicle_type_other', 'current_fund_size', 'target_fund_size',
      'investment_timeframe', 'investment_timeframe_other', 'business_model_targeted', 'business_model_targeted_other',
      'business_stage_targeted', 'business_stage_targeted_other', 'financing_needs', 'financing_needs_other',
      'target_capital_sources', 'target_capital_sources_other', 'target_irr_achieved', 'target_irr_targeted',
      'impact_vs_financial_orientation', 'impact_vs_financial_orientation_other', 'explicit_lens_focus', 'explicit_lens_focus_other',
      'report_sustainable_development_goals', 'top_sdg_1', 'top_sdg_2', 'top_sdg_3', 'top_sdgs', 'other_sdgs',
      'gender_considerations_investment', 'gender_considerations_investment_other', 'gender_considerations_requirement',
      'gender_considerations_requirement_other', 'gender_fund_vehicle', 'gender_fund_vehicle_other'
    ]
  },
  {
    id: 3,
    title: 'Portfolio Construction and Team',
    fields: [
      'investment_size_your_amount', 'investment_size_total_raise', 'investment_forms', 'investment_forms_other',
      'target_sectors', 'target_sectors_other', 'carried_interest_principals', 'current_ftes'
    ]
  },
  {
    id: 4,
    title: 'Portfolio Development & Investment Return Monetization',
    fields: [
      'portfolio_needs_ranking', 'portfolio_needs_other', 'investment_monetization', 'investment_monetization_other',
      'exits_achieved', 'exits_achieved_other', 'fund_capabilities_ranking', 'fund_capabilities_other'
    ]
  },
  {
    id: 5,
    title: 'Impact of COVID-19 on Vehicle and Portfolio',
    fields: [
      'covid_impact_aggregate', 'covid_impact_portfolio', 'covid_government_support', 'covid_government_support_other',
      'raising_capital_2021', 'raising_capital_2021_other', 'fund_vehicle_considerations', 'fund_vehicle_considerations_other'
    ]
  },
  {
    id: 6,
    title: 'Feedback on ESCP Network Membership',
    fields: [
      'network_value_rating', 'working_groups_ranking', 'new_working_group_suggestions',
      'webinar_content_ranking', 'new_webinar_suggestions', 'communication_platform', 'communication_platform_other',
      'network_value_areas', 'present_connection_session', 'present_connection_session_other',
      'convening_initiatives_ranking', 'convening_initiatives_other'
    ]
  },
  {
    id: 7,
    title: '2021 Convening Objectives & Goals',
    fields: [
      'participate_mentoring_program', 'participate_mentoring_program_other', 'present_demystifying_session',
      'present_demystifying_session_other', 'additional_comments'
    ]
  }
];

// 2022 Survey Sections
export const survey2022Sections: SurveySection[] = [
  {
    id: 1,
    title: 'Background Information',
    fields: [
      'name', 'role_title', 'email', 'organisation', 'legal_entity_date', 'first_close_date', 'first_investment_date'
    ]
  },
  {
    id: 2,
    title: 'Geographic Markets and Team',
    fields: [
      'geographic_markets', 'geographic_markets_other', 'team_based', 'team_based_other',
      'current_ftes', 'ye2023_ftes', 'principals_count', 'gp_experience', 'gp_experience_other_description',
      'gender_orientation', 'gender_orientation_other', 'investments_experience', 'exits_experience'
    ]
  },
  {
    id: 3,
    title: 'Vehicle Construct and Fundraising',
    fields: [
      'legal_domicile', 'legal_domicile_other', 'currency_investments', 'currency_lp_commitments',
      'fund_operations', 'fund_operations_other', 'current_funds_raised', 'current_amount_invested',
      'target_fund_size', 'target_investments', 'follow_on_permitted', 'target_irr', 'target_irr_other',
      'concessionary_capital', 'concessionary_capital_other', 'lp_capital_sources', 'lp_capital_sources_other_description',
      'gp_commitment', 'management_fee', 'management_fee_other', 'carried_interest_hurdle', 'carried_interest_hurdle_other',
      'fundraising_constraints', 'fundraising_constraints_other_description'
    ]
  },
  {
    id: 4,
    title: 'Investment Thesis and Strategy',
    fields: [
      'investment_stage', 'investment_type', 'investment_size', 'business_stages', 'business_stages_other_description',
      'enterprise_types', 'financing_needs', 'financing_needs_other_description', 'sector_activities', 'sector_activities_other_description',
      'sector_focus', 'geographic_focus', 'financial_instruments', 'financial_instruments_other_description',
      'sdg_targets', 'gender_lens_investing', 'gender_lens_investing_other_description', 'technology_role_investment_thesis'
    ]
  },
  {
    id: 5,
    title: 'Portfolio Development and Value Creation',
    fields: [
      'pipeline_sourcing', 'pipeline_sourcing_other_description', 'average_investment_size_per_company',
      'portfolio_value_creation_priorities', 'portfolio_value_creation_other_description', 'value_add_services',
      'typical_investment_timeframe', 'investment_monetization_exit_forms', 'investment_monetization_exit_forms_other'
    ]
  },
  {
    id: 6,
    title: 'Portfolio Performance and Exits',
    fields: [
      'equity_exits_achieved', 'debt_repayments_achieved', 'investments_made_to_date', 'other_investments_supplement',
      'anticipated_exits_12_months', 'revenue_growth_recent_12_months', 'cash_flow_growth_recent_12_months',
      'revenue_growth_next_12_months', 'cash_flow_growth_next_12_months', 'portfolio_performance_other_description'
    ]
  },
  {
    id: 7,
    title: 'Jobs Impact',
    fields: [
      'direct_jobs_created_cumulative', 'direct_jobs_anticipated_change', 'indirect_jobs_created_cumulative',
      'indirect_jobs_anticipated_change', 'jobs_impact_other_description'
    ]
  },
  {
    id: 8,
    title: 'Fund Priorities and Concerns',
    fields: [
      'fund_priority_areas', 'fund_priority_areas_other_description', 'domestic_factors_concerns',
      'domestic_factors_concerns_other_description', 'international_factors_concerns',
      'international_factors_concerns_other_description', 'receive_results'
    ]
  }
];

// 2023 Survey Sections
export const survey2023Sections: SurveySection[] = [
  {
    id: 1,
    title: 'Introduction & Context',
    fields: [
      'email_address', 'organisation_name', 'funds_raising_investing', 'fund_name'
    ]
  },
  {
    id: 2,
    title: 'Organizational Background and Team',
    fields: [
      'legal_entity_achieved', 'first_close_achieved', 'first_investment_achieved',
      'geographic_markets', 'geographic_markets_other', 'team_based', 'team_based_other',
      'fte_staff_2022', 'fte_staff_current', 'fte_staff_2024_est', 'principals_count',
      'gender_inclusion', 'gender_inclusion_other', 'team_experience_investments',
      'team_experience_exits', 'team_experience_other'
    ]
  },
  {
    id: 3,
    title: 'Vehicle Construct',
    fields: [
      'legal_domicile', 'legal_domicile_other', 'currency_investments', 'currency_lp_commitments',
      'fund_type_status', 'fund_type_status_other', 'current_funds_raised', 'current_amount_invested',
      'target_fund_size', 'target_investments_count', 'follow_on_investment_permitted',
      'concessionary_capital', 'concessionary_capital_other', 'lp_capital_sources_existing',
      'lp_capital_sources_target', 'gp_financial_commitment', 'gp_financial_commitment_other',
      'gp_management_fee', 'gp_management_fee_other', 'hurdle_rate_currency', 'hurdle_rate_currency_other',
      'hurdle_rate_percentage', 'target_local_currency_return_methods', 'target_local_currency_return',
      'fundraising_constraints', 'fundraising_constraints_other'
    ]
  },
  {
    id: 4,
    title: 'Investment Thesis',
    fields: [
      'business_stages', 'growth_expectations', 'financing_needs', 'sector_focus', 'sector_focus_other',
      'financial_instruments', 'sustainable_development_goals', 'sdg_ranking',
      'gender_lens_investing', 'gender_lens_investing_other'
    ]
  },
  {
    id: 5,
    title: 'Pipeline Sourcing and Portfolio Construction',
    fields: [
      'pipeline_sourcing', 'pipeline_sourcing_other', 'average_investment_size',
      'average_investment_size_per_company', 'capital_raise_percentage',
      'portfolio_funding_mix', 'portfolio_funding_mix_other'
    ]
  },
  {
    id: 6,
    title: 'Portfolio Value Creation and Exits',
    fields: [
      'portfolio_priorities', 'portfolio_priorities_other', 'portfolio_value_creation_priorities',
      'portfolio_value_creation_other', 'technical_assistance_funding', 'technical_assistance_funding_other',
      'business_development_approach', 'business_development_approach_other',
      'business_development_support', 'business_development_support_other',
      'investment_timeframe', 'exit_form', 'exit_form_other'
    ]
  },
  {
    id: 7,
    title: 'Performance to Date and Current Outlook',
    fields: [
      'equity_exits_anticipated', 'debt_exits_anticipated', 'other_investments_description', 'other_investments',
      'portfolio_performance', 'portfolio_performance_other_description', 'jobs_impact',
      'jobs_impact_historical_direct', 'jobs_impact_historical_indirect', 'jobs_impact_expected_direct',
      'jobs_impact_expected_indirect', 'jobs_impact_historical_other', 'jobs_impact_expected_other',
      'jobs_impact_other_description', 'fund_priorities', 'fund_priorities_other_description',
      'revenue_growth_historical', 'revenue_growth_expected', 'cash_flow_growth_historical',
      'cash_flow_growth_expected', 'concerns_ranking', 'concerns_ranking_other',
      'future_research_data', 'future_research_data_other', 'one_on_one_meeting', 'receive_survey_results'
    ]
  }
];

// 2024 Survey Sections
export const survey2024Sections: SurveySection[] = [
  {
    id: 1,
    title: 'Introduction & Context',
    fields: [
      'email_address', 'investment_networks', 'investment_networks_other',
      'organisation_name', 'funds_raising_investing', 'fund_name'
    ]
  },
  {
    id: 2,
    title: 'Organizational Background and Team',
    fields: [
      'legal_entity_achieved', 'first_close_achieved', 'first_investment_achieved',
      'geographic_markets', 'geographic_markets_other', 'team_based', 'team_based_other',
      'fte_staff_2023_actual', 'fte_staff_current', 'fte_staff_2025_forecast',
      'investment_approval', 'investment_approval_other', 'principals_total', 'principals_women',
      'gender_inclusion', 'gender_inclusion_other', 'team_experience_investments', 'team_experience_exits'
    ]
  },
  {
    id: 3,
    title: 'Vehicle Construct',
    fields: [
      'legal_domicile', 'legal_domicile_other', 'domicile_reason', 'domicile_reason_other',
      'regulatory_impact', 'regulatory_impact_other', 'currency_investments', 'currency_lp_commitments',
      'currency_hedging_strategy', 'currency_hedging_details', 'fund_type_status', 'fund_type_status_other',
      'hard_commitments_2022', 'hard_commitments_current', 'amount_invested_2022', 'amount_invested_current',
      'target_fund_size_2022', 'target_fund_size_current', 'target_number_investments', 'follow_on_permitted',
      'concessionary_capital', 'concessionary_capital_other', 'existing_lp_sources', 'existing_lp_sources_other_description',
      'target_lp_sources', 'target_lp_sources_other_description', 'gp_financial_commitment', 'gp_financial_commitment_other',
      'gp_management_fee', 'gp_management_fee_other', 'hurdle_rate_currency', 'hurdle_rate_currency_other',
      'hurdle_rate_percentage', 'target_return_above_govt_debt', 'fundraising_barriers', 'fundraising_barriers_other_description'
    ]
  },
  {
    id: 4,
    title: 'Investment Thesis',
    fields: [
      'business_stages', 'revenue_growth_mix', 'financing_needs', 'sector_target_allocation',
      'investment_considerations', 'investment_considerations_other', 'financial_instruments_ranking',
      'top_sdgs', 'additional_sdgs', 'gender_lens_investing'
    ]
  },
  {
    id: 5,
    title: 'Pipeline Sourcing and Portfolio Construction',
    fields: [
      'pipeline_sources_quality', 'pipeline_sources_quality_other_description', 'pipeline_sources_quality_other_score',
      'sgb_financing_trends', 'typical_investment_size'
    ]
  },
  {
    id: 6,
    title: 'Portfolio Value Creation and Exits',
    fields: [
      'post_investment_priorities', 'post_investment_priorities_other_description', 'post_investment_priorities_other_score',
      'technical_assistance_funding', 'business_development_approach', 'business_development_approach_other',
      'unique_offerings', 'unique_offerings_other_description', 'unique_offerings_other_score',
      'typical_investment_timeframe', 'investment_monetisation_forms', 'investment_monetisation_other'
    ]
  },
  {
    id: 7,
    title: 'Performance to Date and Current Outlook',
    fields: [
      'equity_investments_made', 'debt_investments_made', 'equity_exits_achieved', 'debt_repayments_achieved',
      'equity_exits_anticipated', 'debt_repayments_anticipated', 'other_investments_supplement',
      'portfolio_revenue_growth_12m', 'portfolio_revenue_growth_next_12m', 'portfolio_cashflow_growth_12m',
      'portfolio_cashflow_growth_next_12m', 'portfolio_performance_other_description', 'portfolio_performance_other_category',
      'portfolio_performance_other_value', 'direct_jobs_current', 'indirect_jobs_current', 'direct_jobs_anticipated',
      'indirect_jobs_anticipated', 'employment_impact_other_description', 'employment_impact_other_category',
      'employment_impact_other_value', 'fund_priorities_next_12m', 'fund_priorities_other_description',
      'fund_priorities_other_category', 'data_sharing_willingness', 'data_sharing_other', 'survey_sender', 'receive_results'
    ]
  }
];

// Helper function to get sections for a specific year
export const getSurveySections = (year: number): SurveySection[] => {
  switch (year) {
    case 2021:
      return survey2021Sections;
    case 2022:
      return survey2022Sections;
    case 2023:
      return survey2023Sections;
    case 2024:
      return survey2024Sections;
    default:
      return [];
  }
};

// Helper function to get the section title for a specific field and year
export const getFieldSection = (fieldName: string, year: number): string | null => {
  const sections = getSurveySections(year);
  const section = sections.find(s => s.fields.includes(fieldName));
  return section ? section.title : null;
};
