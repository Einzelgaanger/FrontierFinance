import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Send, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  resource_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: {
    full_name: string;
    company_name: string;
    profile_picture_url: string | null;
  };
}

interface LearningResourceCommentSectionProps {
  resourceId: string;
}

export function LearningResourceCommentSection({ resourceId }: LearningResourceCommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from("learning_resource_comments")
        .select("*")
        .eq("resource_id", resourceId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const userIds = [...new Set(commentsData?.map((c) => c.user_id) || [])];
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, full_name, company_name, profile_picture_url")
        .in("id", userIds);

      const commentsWithAuthors = (commentsData || []).map((comment) => ({
        ...comment,
        author: profiles?.find((p) => p.id === comment.user_id),
      }));

      setComments(commentsWithAuthors);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("learning_resource_comments").insert({
        resource_id: resourceId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      toast.success("Comment posted!");
      setNewComment("");
      fetchComments();
    } catch (error: unknown) {
      toast.error("Failed to post comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("learning_resource_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted");
      fetchComments();
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {user && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your thoughts or questions..."
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={submitting || !newComment.trim()} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Post comment
          </Button>
        </form>
      )}

      <div className="space-y-0">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 py-5 border-b border-slate-100 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))}
          </>
        ) : comments.length === 0 ? (
          <p className="text-slate-500 text-sm py-6">No comments yet. Be the first to share feedback.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 py-5 border-b border-slate-100 last:border-0">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.author?.profile_picture_url || ""} />
                <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                  {comment.author?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-slate-900">{comment.author?.full_name || "Unknown"}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {user?.id === comment.user_id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="text-slate-400 hover:text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {comment.author?.company_name && (
                  <p className="text-xs text-slate-500 mb-1">{comment.author.company_name}</p>
                )}
                <p className="text-slate-700 text-sm leading-relaxed break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
