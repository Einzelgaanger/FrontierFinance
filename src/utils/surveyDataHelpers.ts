// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

/**
 * Survey tables by year - the actual tables in the database.
 * There is NO generic "survey_responses" table.
 */
const SURVEY_TABLES = [
  { year: 2021, table: 'survey_responses_2021', nameField: 'firm_name', emailField: 'email_address' },
  { year: 2022, table: 'survey_responses_2022', nameField: 'organisation', emailField: 'email' },
  { year: 2023, table: 'survey_responses_2023', nameField: 'organisation_name', emailField: 'email_address' },
  { year: 2024, table: 'survey_responses_2024', nameField: 'fund_name', emailField: 'email_address' },
] as const;

export { SURVEY_TABLES };

/**
 * Fetch completed survey counts across all years.
 * Returns total count of completed surveys.
 */
export async function fetchCompletedSurveyCount(): Promise<number> {
  let total = 0;
  for (const { table } of SURVEY_TABLES) {
    const { count, error } = await supabase
      .from(table as any)
      .select('id', { count: 'exact', head: true })
      .eq('submission_status', 'completed');
    if (!error && count) total += count;
  }
  return total;
}

/**
 * Fetch completed surveys this month across all years.
 */
export async function fetchCompletedSurveysThisMonth(): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  let total = 0;
  for (const { table } of SURVEY_TABLES) {
    const { count, error } = await supabase
      .from(table as any)
      .select('id', { count: 'exact', head: true })
      .eq('submission_status', 'completed')
      .gte('completed_at', startOfMonth.toISOString());
    if (!error && count) total += count;
  }
  return total;
}

/**
 * Fetch recent completed surveys across all years.
 * Returns normalized results with common fields.
 */
export async function fetchRecentCompletedSurveys(limit: number = 5): Promise<any[]> {
  const allSurveys: any[] = [];
  
  for (const { year, table, nameField } of SURVEY_TABLES) {
    const { data, error } = await supabase
      .from(table as any)
      .select(`id, user_id, completed_at, ${nameField}`)
      .eq('submission_status', 'completed')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);
    
    if (!error && data) {
      data.forEach((row: any) => {
        allSurveys.push({
          id: row.id,
          user_id: row.user_id,
          completed_at: row.completed_at,
          fund_name: row[nameField] || 'Unknown',
          survey_year: year,
        });
      });
    }
  }
  
  // Sort by completed_at descending and take the top `limit`
  return allSurveys
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, limit);
}

/**
 * Fetch all completed survey data for a specific year.
 */
export async function fetchSurveyDataForYear(year: number): Promise<any[]> {
  const config = SURVEY_TABLES.find(t => t.year === year);
  if (!config) return [];
  
  const { data, error } = await supabase
    .from(config.table as any)
    .select('*')
    .eq('submission_status', 'completed');
  
  if (error) {
    console.warn(`Error fetching ${config.table}:`, error);
    return [];
  }
  return data || [];
}

/**
 * Fetch all completed surveys across all years.
 */
export async function fetchAllCompletedSurveys(): Promise<any[]> {
  const allData: any[] = [];
  
  for (const { year, table, nameField } of SURVEY_TABLES) {
    const { data, error } = await supabase
      .from(table as any)
      .select('*')
      .eq('submission_status', 'completed');
    
    if (!error && data) {
      data.forEach((row: any) => {
        allData.push({
          ...row,
          _survey_year: year,
          _fund_name: row[nameField] || 'Unknown',
        });
      });
    }
  }
  
  return allData;
}
