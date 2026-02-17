// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { fetchAllCompletedSurveys } from '@/utils/surveyDataHelpers';

export const populateMemberSurveys = async () => {
  try {
    console.log('Starting member surveys population...');
    
    // Get all completed survey responses from all year-specific tables
    const responses = await fetchAllCompletedSurveys();

    console.log(`Found ${responses.length} completed survey responses`);

    if (responses.length === 0) {
      console.log('No completed survey responses found');
      return;
    }

    // Process each response and create/update member survey
    for (const response of responses) {
      try {
        const memberSurveyData = {
          user_id: response.user_id,
          fund_name: response._fund_name || 'Unknown Fund',
          completed_at: response.completed_at
        };

        // Check if member survey already exists
        const { data: existingMemberSurvey } = await supabase
          .from('member_surveys')
          .select('id')
          .eq('user_id', response.user_id)
          .single();

        if (existingMemberSurvey) {
          const { error: updateError } = await supabase
            .from('member_surveys')
            .update(memberSurveyData)
            .eq('user_id', response.user_id);

          if (updateError) {
            console.error('Error updating member survey for user:', response.user_id, updateError);
          }
        } else {
          const { error: insertError } = await supabase
            .from('member_surveys')
            .insert([memberSurveyData]);

          if (insertError) {
            console.error('Error creating member survey for user:', response.user_id, insertError);
          }
        }
      } catch (error) {
        console.error('Error processing response:', response.id, error);
      }
    }

    console.log('Member surveys population completed');
  } catch (error) {
    console.error('Error in populateMemberSurveys:', error);
  }
};
