import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { MessageSquare, GraduationCap, Lock, Info } from "lucide-react";
import { BlogFeed } from "@/components/community/BlogFeed";
import { LearningHub } from "@/components/community/LearningHub";

export default function Community() {
  const { userRole } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'blogs' | 'learning'>('blogs');

  // When returning from Learning Resource detail, open Learning tab
  useEffect(() => {
    const tab = (location.state as { tab?: 'blogs' | 'learning' })?.tab;
    if (tab === 'learning' || tab === 'blogs') {
      setActiveTab(tab);
    }
  }, [location.state]);

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
      <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        {/* Page header — compact, same pattern as other app pages */}
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Community</span>
                <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">Hub</h1>
                <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">
                  {activeTab === 'blogs' ? "Network updates and insights" : "Curated learning resources"}
                </p>
              </div>
              {/* Tab switcher — navy/gold */}
              <div className="flex items-center gap-0.5 bg-white border border-slate-200/80 rounded-lg p-0.5 shadow-finance">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium font-sans transition-all ${
                    activeTab === 'blogs'
                      ? 'bg-navy-900 text-gold-400 shadow-finance'
                      : 'text-navy-900 hover:bg-gold-50/80'
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  Updates
                </button>
                <button
                  onClick={() => canAccessLearning && setActiveTab('learning')}
                  disabled={!canAccessLearning}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium font-sans transition-all ${
                    activeTab === 'learning'
                      ? 'bg-navy-900 text-gold-400 shadow-finance'
                      : 'text-navy-900 hover:bg-gold-50/80'
                  } ${!canAccessLearning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!canAccessLearning && <Lock className="h-2.5 w-2.5 shrink-0" />}
                  <GraduationCap className="h-3 w-3" />
                  Learning
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-3 sm:py-4 min-w-0 overflow-x-hidden">
          {/* Viewer notice */}
          {userRole === 'viewer' && activeTab === 'blogs' && (
            <div className="mb-3 flex items-center gap-1.5 py-1.5 px-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg">
              <Info className="h-3 w-3 text-gold-600 shrink-0" />
              <p className="text-[11px] text-amber-800 font-sans">
                Learning resources are available to members. Apply for membership for full access.
              </p>
            </div>
          )}

          {activeTab === 'blogs' ? <BlogFeed /> : <LearningHub />}
        </div>
      </div>
    </SidebarLayout>
  );
}