import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { MessageSquare, GraduationCap, Lock, Info } from "lucide-react";
import { BlogFeed } from "@/components/community/BlogFeed";
import { LearningHub } from "@/components/community/LearningHub";

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
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Clean Header */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold text-slate-900">Community</h1>
                  <span className="text-xs text-slate-400">|</span>
                  <p className="text-sm text-slate-500">
                    {activeTab === 'blogs' 
                      ? "Network updates and insights"
                      : "Curated learning resources"}
                  </p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'blogs' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Updates
                  </button>
                  <button
                    onClick={() => canAccessLearning && setActiveTab('learning')}
                    disabled={!canAccessLearning}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'learning' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    } ${!canAccessLearning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!canAccessLearning && <Lock className="h-3 w-3" />}
                    <GraduationCap className="h-3.5 w-3.5" />
                    Learning
                  </button>
                </div>
              </div>
            </div>

            {/* Viewer Notice */}
            {userRole === 'viewer' && activeTab === 'blogs' && (
              <div className="mx-5 mt-4 flex items-center gap-2 py-2 px-3 bg-amber-50 border border-amber-100 rounded-lg">
                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800">
                  Learning resources are available to members. Apply for membership for full access.
                </p>
              </div>
            )}

            {/* Content Area */}
            <div className="p-5">
              {activeTab === 'blogs' ? <BlogFeed /> : <LearningHub />}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}