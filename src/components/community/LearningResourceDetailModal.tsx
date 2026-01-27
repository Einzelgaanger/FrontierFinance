import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Heart, ExternalLink, Star, Link as LinkIcon, Video } from "lucide-react";
import { LearningResourceCommentSection } from "./LearningResourceCommentSection";

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

interface LearningResourceDetailModalProps {
  resource: {
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
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  likeCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
}

export function LearningResourceDetailModal({
  resource,
  open,
  onOpenChange,
  likeCount,
  isLiked,
  onToggleLike,
}: LearningResourceDetailModalProps) {
  if (!resource) return null;

  const topic = resource.topic ?? "other";
  const topicLabel =
    topic === "other" && resource.topic_other
      ? resource.topic_other
      : topicConfig[topic] ?? "Learning";
  const mediaType = resource.media_type ?? "link";
  const thumbOrMedia = resource.thumbnail_url ?? (mediaType === "image" ? resource.resource_url : null);
  const isVideo = mediaType === "video";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Media: full-width, prominent */}
        <div className="w-full bg-slate-100">
          {thumbOrMedia ? (
            <div className="aspect-video w-full overflow-hidden">
              {isVideo && resource.resource_url ? (
                <video
                  src={resource.resource_url}
                  controls
                  playsInline
                  poster={resource.thumbnail_url || undefined}
                  className="w-full h-full object-contain bg-slate-900"
                />
              ) : (
                <img
                  src={thumbOrMedia}
                  alt={resource.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center bg-slate-200/60">
              {mediaType === "video" ? (
                <Video className="h-16 w-16 text-slate-400" />
              ) : (
                <LinkIcon className="h-16 w-16 text-slate-400" />
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-slate-600">
                {topicLabel}
              </Badge>
              {resource.is_featured && (
                <Badge className="bg-amber-500 text-white border-0 gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {format(new Date(resource.created_at), "MMMM d, yyyy")}
              </span>
            </div>
            <DialogTitle className="text-xl md:text-2xl font-semibold leading-tight pr-8">
              {resource.title}
            </DialogTitle>
          </DialogHeader>

          {resource.description && (
            <p className="text-slate-600 leading-relaxed">{resource.description}</p>
          )}

          {resource.content && (
            <div className="prose prose-sm max-w-none border-t pt-4">
              <p className="whitespace-pre-wrap text-slate-700">{resource.content}</p>
            </div>
          )}

          {/* Like + Open resource */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleLike();
              }}
              className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-400"}`}
              />
              <span className="font-medium">{likeCount} like{likeCount !== 1 ? "s" : ""}</span>
            </button>
            {resource.resource_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a
                  href={resource.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open resource
                </a>
              </Button>
            )}
          </div>

          {/* Comments */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Comments</h3>
            <LearningResourceCommentSection resourceId={resource.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
