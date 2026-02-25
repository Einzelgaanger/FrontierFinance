import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Hide feedback button on external pages, auth pages, and a few others
  const hiddenPages = [
    '/', '/about', '/escp-network', '/learning-hub', '/our-events', '/partnership',
    '/auth', '/reset-password', '/forgot-password',
    '/launch-plus-intro', '/launch-plus-assessment',
    '/devtasks', '/drew',
  ];
  const isSurveyPage = location.pathname.startsWith('/survey');
  if (hiddenPages.includes(location.pathname) || isSurveyPage) {
    return null;
  }

  // Get page name from route
  const getPageName = (pathname: string): string => {
    const routes: Record<string, string> = {
      '/': 'Homepage',
      '/dashboard': 'Dashboard',
      '/network': 'Network',
      '/survey': 'Survey',
      '/survey/2021': 'Survey 2021',
      '/survey/2022': 'Survey 2022',
      '/survey/2023': 'Survey 2023',
      '/survey/2024': 'Survey 2024',
      '/profile': 'Profile',
      '/application': 'Application',
      '/community': 'Community',
      '/blogs': 'Blogs',
      '/admin': 'Admin Dashboard',
      '/analytics': 'Analytics',
      '/portiq': 'PortIQ',
    };

    // Check for dynamic routes
    if (pathname.startsWith('/network/fund-manager/')) {
      return 'Fund Manager Detail';
    }
    if (pathname.startsWith('/blogs/')) {
      return 'Blog Detail';
    }
    if (pathname.startsWith('/survey-response/')) {
      return 'Survey Response Viewer';
    }

    return routes[pathname] || pathname;
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          message: message.trim(),
          page_url: location.pathname,
          page_name: getPageName(location.pathname),
          user_email: user?.email || null,
          user_role: userRole || null,
          user_id: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: 'Feedback submitted!',
        description: 'Thank you for your feedback. We\'ll review it soon.',
      });

      setMessage('');
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission failed',
        description: error.message || 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center text-white group"
        aria-label="Submit feedback"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Feedback Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              Help us improve by sharing your thoughts, reporting issues, or suggesting features.
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                Current page: {getPageName(location.pathname)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Your Feedback</Label>
              <Textarea
                id="feedback-message"
                placeholder="Describe the issue, share your thoughts, or suggest improvements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setMessage('');
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
