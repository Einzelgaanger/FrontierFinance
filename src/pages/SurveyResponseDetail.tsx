// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  FileText,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SURVEY_TABLES } from '@/utils/surveyDataHelpers';

const SurveyResponseDetail = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [surveyYear, setSurveyYear] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (responseId) {
      fetchSurveyResponse();
    }
  }, [responseId]);

  const fetchSurveyResponse = async () => {
    try {
      setLoading(true);
      setError(null);

      // Search across all year-specific tables for this response ID
      for (const { year, table, nameField } of SURVEY_TABLES) {
        const { data, error: fetchError } = await supabase
          .from(table as any)
          .select('*')
          .eq('id', responseId)
          .maybeSingle();

        if (!fetchError && data) {
          setSurveyData({ ...data, _fund_name: data[nameField] });
          setSurveyYear(year);
          return;
        }
      }

      throw new Error('Survey response not found in any year table');
    } catch (err: any) {
      console.error('Error fetching survey response:', err);
      setError(err.message || 'Failed to load survey response');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !surveyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-800">{error || 'Survey response not found'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/network')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Network
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get all non-null, non-internal fields as key-value pairs
  const responseFields = Object.entries(surveyData)
    .filter(([key, value]) => 
      value !== null && 
      value !== '' && 
      !['id', 'user_id', 'created_at', 'updated_at', 'completed_at', 'submission_status', 'form_data', '_fund_name', '_survey_year'].includes(key)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            className="mb-4"
            onClick={() => navigate('/network')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {surveyData._fund_name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Survey Year: {surveyYear}
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">
              {surveyYear}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Total Fields</p>
              <p className="text-2xl font-bold text-slate-800">{responseFields.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-lg font-semibold text-slate-800">
                {surveyData.completed_at ? new Date(surveyData.completed_at).toLocaleDateString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <Badge>{surveyData.submission_status}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Survey Responses</CardTitle>
          </CardHeader>
          <CardContent>
            {responseFields.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No responses found</p>
            ) : (
              <div className="space-y-4">
                {responseFields.map(([key, value]) => (
                  <div key={key} className="border-b border-slate-200 pb-4 last:border-0">
                    <p className="font-medium text-slate-800 mb-1">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <div className="bg-slate-50 rounded-md p-3">
                      <p className="text-slate-700">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyResponseDetail;
