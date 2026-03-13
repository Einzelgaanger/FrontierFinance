import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Heart,
  ArrowLeft,
  Loader2,
  MessageCircle,
  ExternalLink,
  Star,
  Video,
} from "lucide-react";
import { LearningResourceCommentSection } from "@/components/community/LearningResourceCommentSection";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const topicConfig: Record<string, string> = {
  investment_thesis: "Investment thesis",
  fund_economics: "Fund economics",
  capital_raising: "Capital raising",
  team: "Team",
  track_record: "Track record",
  investment_process: "Investment process",
  operations: "Operations",
  esg_impact: "ESG & Impact",
  sme_support: "SME support",
  other: "Other",
};

interface LearningResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  topic?: string | null;
  topic_other?: string | null;
  media_type?: "link" | "image" | "video" | null;
  thumbnail_url: string | null;
  resource_url: string | null;
  is_featured: boolean;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
}

export default function LearningResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResource = useCallback(async () => {
    if (!id) return;
    try {
      const { data: row, error } = await supabase
        .from("learning_resources")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error || !row) throw new Error("Not found");

      let isLiked = false;
      if (user) {
        const { data: likeRow } = await supabase
          .from("learning_resource_likes")
          .select("id")
          .eq("resource_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        isLiked = !!likeRow;
      }

      const { data: likes } = await supabase
        .from("learning_resource_likes")
        .select("id")
        .eq("resource_id", id);
      const { data: comments } = await supabase
        .from("learning_resource_comments")
        .select("id")
        .eq("resource_id", id);

      setResource({
        ...row,
        media_type: row.media_type as "link" | "image" | "video" | null,
        like_count: likes?.length ?? 0,
        comment_count: comments?.length ?? 0,
        is_liked: isLiked,
      } as LearningResource);
    } catch {
      toast.error("Resource not found");
      navigate("/community", { state: { tab: "learning" } });
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  useEffect(() => {
    if (!id) return;
    const ch = supabase
      .channel(`learning-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "learning_resource_likes", filter: `resource_id=eq.${id}` },
        fetchResource
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "learning_resource_comments", filter: `resource_id=eq.${id}` },
        fetchResource
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id, fetchResource]);

  const toggleLike = async () => {
    if (!user || !resource) return;
    try {
      if (resource.is_liked) {
        await supabase
          .from("learning_resource_likes")
          .delete()
          .eq("resource_id", resource.id)
          .eq("user_id", user.id);
      } else {
        await supabase.from("learning_resource_likes").insert({
          resource_id: resource.id,
          user_id: user.id,
        });
      }
      await fetchResource();
    } catch {
      toast.error("Failed to update like");
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center font-sans antialiased">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            <p className="text-xs text-slate-600">Loading resource…</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!resource) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
          <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Learning</span>
                  <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">Resource</h1>
                  <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                  <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Resource not found</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/community", { state: { tab: "learning" } })} className="h-8 rounded-lg border-slate-200 text-navy-900 hover:border-gold-500/40 font-sans text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Back to community
                </Button>
              </div>
            </div>
          </header>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex justify-center">
            <Button onClick={() => navigate("/community", { state: { tab: "learning" } })} className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white shadow-finance font-sans text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to community
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const topic = resource.topic ?? "other";
  const topicLabel =
    topic === "other" && resource.topic_other
      ? resource.topic_other
      : topicConfig[topic] ?? "Learning";
  const mediaType = resource.media_type ?? "link";
  const thumbOrMedia = resource.thumbnail_url ?? (mediaType === "image" ? resource.resource_url : null);
  const isVideo = mediaType === "video";
  const hasMedia = thumbOrMedia || (isVideo && resource.resource_url);

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Learning</span>
                <h1 className="text-base sm:text-lg font-display font-normal text-navy-900 truncate">Resource</h1>
                <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                <p className="text-[10px] text-slate-500 font-sans hidden sm:inline truncate">{resource.title}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/community", { state: { tab: "learning" } })} className="h-8 rounded-lg border-slate-200 text-navy-900 hover:border-gold-500/40 font-sans text-xs shrink-0">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to community
              </Button>
            </div>
          </div>
        </header>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-w-0 overflow-x-hidden">

          <div className="flex items-center gap-2 mb-4 text-[10px] font-sans">
            <span className="text-gold-600 font-bold uppercase tracking-[0.12em]">{topicLabel}</span>
            {resource.is_featured && (
              <span className="inline-flex items-center gap-1 text-gold-700 font-medium">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
          </div>

          {hasMedia && (
            <div className="mb-6 sm:mb-8 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-slate-900 shadow-finance">
              <div className="aspect-video max-h-[80vh] w-full overflow-hidden">
                {isVideo && resource.resource_url ? (
                  <video
                    src={resource.resource_url}
                    poster={resource.thumbnail_url || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                ) : thumbOrMedia ? (
                  <img src={thumbOrMedia} alt={resource.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-16 w-16 text-slate-500" />
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-500 mb-1 break-words font-sans">
            {format(new Date(resource.created_at), "MMMM d, yyyy")}
          </p>
          <h1 className="text-xl sm:text-2xl font-display font-normal text-navy-900 tracking-tight leading-tight mb-4 break-words">
            {resource.title}
          </h1>

          {resource.resource_url && (
            <a
              href={resource.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-sans font-medium text-sm mb-4"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              Open resource
            </a>
          )}

          {resource.description && (
            <p className="text-slate-600 leading-relaxed mb-4 break-words min-w-0 w-full max-w-full text-sm">{resource.description}</p>
          )}

          {resource.content && (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-8 break-words min-w-0 w-full max-w-full text-sm rounded-xl border border-slate-200/90 bg-white shadow-finance p-4 sm:p-5">{resource.content}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 py-3 mb-8 border-t border-b border-slate-200/80 min-w-0">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 text-slate-600 hover:text-gold-600 transition-colors shrink-0 font-sans text-sm"
            >
              <Heart className={`h-4 w-4 ${resource.is_liked ? "fill-gold-500 text-gold-500" : ""}`} />
              <span>{resource.like_count} likes</span>
            </button>
            <span className="flex items-center gap-2 text-slate-500 shrink-0 font-sans text-sm">
              <MessageCircle className="h-4 w-4" />
              {resource.comment_count} comments
            </span>
            {resource.resource_url && (
              <a
                href={resource.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium shrink-0 font-sans"
              >
                <ExternalLink className="h-4 w-4" />
                Open resource
              </a>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Discussion</span>
            <h2 className="text-base font-display font-normal text-navy-900">
              Comments
              <span className="font-sans font-normal text-slate-500 text-sm"> ({resource.comment_count})</span>
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 mb-4 font-sans">Share feedback and questions</p>
          <LearningResourceCommentSection resourceId={resource.id} />
        </div>
      </div>
    </SidebarLayout>
  );
}
