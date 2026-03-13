import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Link as LinkIcon, Image, Video, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostAttachment {
  id: string;
  attachment_type: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

interface AttachmentDisplayProps {
  blogId?: string;
  resourceId?: string;
  /** Compact mode for cards (show count only) */
  compact?: boolean;
}

export function AttachmentDisplay({ blogId, resourceId, compact = false }: AttachmentDisplayProps) {
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);

  useEffect(() => {
    if (!blogId && !resourceId) return;
    const fetchAttachments = async () => {
      let query = supabase
        .from("post_attachments")
        .select("id, attachment_type, url, caption, sort_order")
        .order("sort_order", { ascending: true });

      if (blogId) query = query.eq("blog_id", blogId);
      if (resourceId) query = query.eq("resource_id", resourceId);

      const { data } = await query;
      if (data) setAttachments(data);
    };
    fetchAttachments();
  }, [blogId, resourceId]);

  if (attachments.length === 0) return null;

  if (compact) {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0.5">
        <Paperclip className="h-3 w-3" />
        {attachments.length}
      </Badge>
    );
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-3.5 w-3.5" />;
      case "video": return <Video className="h-3.5 w-3.5" />;
      default: return <LinkIcon className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
        <Paperclip className="h-4 w-4" />
        Attachments ({attachments.length})
      </h4>
      <div className="grid gap-2">
        {attachments.map(att => (
          <div key={att.id}>
            {att.attachment_type === "image" && att.url && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img src={att.url} alt={att.caption || "Attachment"} className="w-full max-h-[300px] object-contain bg-slate-50" />
                {att.caption && (
                  <p className="text-xs text-slate-500 px-3 py-1.5 border-t border-slate-100 italic">{att.caption}</p>
                )}
              </div>
            )}
            {att.attachment_type === "video" && att.url && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <video src={att.url} controls className="w-full max-h-[300px]" />
                {att.caption && (
                  <p className="text-xs text-slate-500 px-3 py-1.5 border-t border-slate-100 italic">{att.caption}</p>
                )}
              </div>
            )}
            {att.attachment_type === "link" && att.url && (
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded bg-slate-100 text-slate-500 group-hover:text-blue-600 shrink-0">
                  {typeIcon("link")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-blue-600 truncate group-hover:underline">{att.url}</p>
                  {att.caption && <p className="text-xs text-slate-500 truncate">{att.caption}</p>}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
