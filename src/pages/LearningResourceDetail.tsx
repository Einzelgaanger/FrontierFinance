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
        <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
        </div>
      </SidebarLayout>
    );
  }

  if (!resource) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold text-slate-700">Resource not found</h1>
            <Button variant="outline" onClick={() => navigate("/community", { state: { tab: "learning" } })}>
              Back to Community
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
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl px-4 sm:px-6 py-4 md:py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/community", { state: { tab: "learning" } })}
            className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Back to community
          </Button>

          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="text-slate-500">{topicLabel}</span>
            {resource.is_featured && (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <Star className="h-3.5 w-3.5" /> Featured
              </span>
            )}
          </div>

          {hasMedia && (
            <div className="mb-8 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
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

          <p className="text-sm text-slate-500 mb-2 break-words">
            {format(new Date(resource.created_at), "MMMM d, yyyy")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-6 break-words">
            {resource.title}
          </h1>

          {resource.resource_url && (
            <a
              href={resource.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium text-sm mb-6"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              Open resource
            </a>
          )}

          {resource.description && (
            <p className="text-slate-600 leading-relaxed mb-6 break-words min-w-0 w-full max-w-full">{resource.description}</p>
          )}

          {resource.content && (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-10 break-words min-w-0 w-full max-w-full">{resource.content}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 py-4 mb-10 border-t border-b border-slate-100 min-w-0">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors shrink-0"
            >
              <Heart className={`h-5 w-5 ${resource.is_liked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{resource.like_count} likes</span>
            </button>
            <span className="flex items-center gap-2 text-slate-500 shrink-0">
              <MessageCircle className="h-5 w-5" />
              {resource.comment_count} comments
            </span>
            {resource.resource_url && (
              <a
                href={resource.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
                Open resource
              </a>
            )}
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Comments
            <span className="font-normal text-slate-500"> ({resource.comment_count})</span>
          </h2>
          <p className="text-sm text-slate-500 mb-6">Share feedback and questions</p>
          <LearningResourceCommentSection resourceId={resource.id} />
        </div>
      </div>
    </SidebarLayout>
  );
}
