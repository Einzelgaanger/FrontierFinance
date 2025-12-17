import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, GraduationCap, Lock } from "lucide-react";
import { BlogFeed } from "@/components/community/BlogFeed";
import { LearningHub } from "@/components/community/LearningHub";
import { Card, CardContent } from "@/components/ui/card";

export default function Community() {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'blogs' | 'learning'>('blogs');

  useEffect(() => {
    document.title = "Community | CFF Network";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Connect, share insights, and learn with the CFF fund manager community");
    }
  }, []);

  // Viewers can only access blogs, not learning hub
  const canAccessLearning = userRole === 'admin' || userRole === 'member';

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header with Toggle */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Community Hub</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {activeTab === 'blogs' 
                    ? "Share insights and connect with fellow fund managers" 
                    : "Access curated resources to enhance your fund management expertise"}
                </p>
              </div>
              
              {/* Toggle Switcher */}
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => {
                  if (v === 'learning' && !canAccessLearning) return;
                  setActiveTab(v as 'blogs' | 'learning');
                }}
                className="w-fit"
              >
                <TabsList className="bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger 
                    value="blogs"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Blog Feed</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="learning"
                    disabled={!canAccessLearning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!canAccessLearning && <Lock className="h-3 w-3" />}
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-medium">Learning Hub</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Viewer Access Restriction Notice */}
          {userRole === 'viewer' && activeTab === 'blogs' && (
            <Card className="mb-4 border-amber-200 bg-amber-50/50">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Lock className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Learning Hub is exclusive to members.</span>{" "}
                  Apply for membership to access curated learning resources.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Content Area */}
          {activeTab === 'blogs' ? (
            <BlogFeed />
          ) : (
            <LearningHub />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}