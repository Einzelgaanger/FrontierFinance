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
      metaDescription.setAttribute(
        "content",
        "CFF Community Hub – structured space for fund managers to share updates and access curated learning resources."
      );
    }
  }, []);

  // Viewers can only access blogs, not learning hub
  const canAccessLearning = userRole === 'admin' || userRole === 'member';

  return (
    <SidebarLayout>
      <div
        className="min-h-screen bg-slate-900/80"
        style={{
          backgroundImage: 'url(/CFF.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 px-4 py-5 sm:px-6 sm:py-6 shadow-sm">
            {/* Header with toggle */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Community hub</h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {activeTab === 'blogs' 
                      ? "Structured space for sharing updates, insights and perspectives across the CFF network."
                      : "Central access point for curated learning materials and practitioner resources."}
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
                  <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <TabsTrigger 
                      value="blogs"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">Network updates</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="learning"
                      disabled={!canAccessLearning}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!canAccessLearning && <Lock className="h-3 w-3" />}
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-medium">Learning resources</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Viewer Access Restriction Notice */}
            {userRole === 'viewer' && activeTab === 'blogs' && (
              <Card className="mb-4 border-amber-200 bg-amber-50/60">
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <Lock className="h-4 w-4 text-amber-700" />
                  <p className="text-sm text-amber-900">
                    <span className="font-medium">Learning resources are available to members.</span>{" "}
                    Please apply for membership if you require full access to the curriculum.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Content Area */}
            <div className="mt-2">
              {activeTab === 'blogs' ? (
                <BlogFeed />
              ) : (
                <LearningHub />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}