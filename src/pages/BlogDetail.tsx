import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Heart, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { BlogCommentSection } from "@/components/blogs/BlogCommentSection";
import { getBadge } from "@/utils/badgeSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_type: "text" | "image" | "video" | null;
  media_url: string | null;
  thumbnail_url?: string | null;
  caption: string | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  author?: {
    full_name: string;
    company_name: string;
    profile_picture_url: string | null;
    total_points?: number;
  };
  is_liked?: boolean;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchBlog = useCallback(async () => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (blogError) throw blogError;

      const [profileRes, creditRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .eq("id", blogData.user_id)
          .single(),
        supabase.from("user_credits").select("total_points").eq("user_id", blogData.user_id).single(),
      ]);

      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from("blog_likes" as any)
          .select("id")
          .eq("blog_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        isLiked = !!likeData;
      }

      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("*")
        .eq("blog_id", blogData.id);
      const { data: commentCounts } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_id", blogData.id);

      const fullBlog: Blog = {
        ...blogData,
        media_type: blogData.media_type as "text" | "image" | "video" | null,
        like_count: likeCounts?.length || 0,
        comment_count: commentCounts?.length || 0,
        is_liked: isLiked,
        author: profileRes.data
          ? { ...profileRes.data, total_points: creditRes.data?.total_points || 0 }
          : undefined,
      };

      setBlog(fullBlog);
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load post");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (id) fetchBlog();
    const subs: any[] = [];
    if (id) {
      subs.push(
        supabase
          .channel(`blog-likes-${id}`)
          .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "blog_likes",
            filter: `blog_id=eq.${id}`,
          }, fetchBlog)
          .subscribe()
      );
      subs.push(
        supabase
          .channel(`blog-comments-${id}`)
          .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "blog_comments",
            filter: `blog_id=eq.${id}`,
          }, fetchBlog)
          .subscribe()
      );
    }
    return () => subs.forEach((s) => supabase.removeChannel(s));
  }, [id, fetchBlog]);

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Sign in to like posts");
      return;
    }
    try {
      if (isLiked) {
        await supabase.from("blog_likes" as any).delete().eq("blog_id", blogId).eq("user_id", user.id);
      } else {
        await supabase.from("blog_likes" as any).insert({ blog_id: blogId, user_id: user.id });
      }
      await fetchBlog();
    } catch (error) {
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

  if (!blog) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold text-slate-700">Post not found</h1>
            <Button variant="outline" onClick={() => navigate("/blogs")}>
              Back to Updates
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const hasMedia = (blog.media_type === "image" || blog.media_type === "video") && blog.media_url;

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl px-4 sm:px-6 py-4 md:py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/blogs")}
            className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Back to updates
          </Button>

          {hasMedia && (
            <div className="mb-8 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
              <div className="aspect-video max-h-[80vh] w-full overflow-hidden">
                {blog.media_type === "image" ? (
                  <img src={blog.media_url} alt={blog.title} className="w-full h-full object-contain" />
                ) : (
                  <video
                    src={blog.media_url}
                    poster={blog.thumbnail_url || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {blog.caption && (
                <p className="mt-3 px-4 sm:px-6 pb-3 text-sm text-slate-400 italic break-words w-full">
                  {blog.caption}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={blog.author?.profile_picture_url || ""} />
              <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-medium">
                {blog.author?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 break-words">
                {blog.author?.full_name || "Author"}
                {blog.author?.total_points !== undefined && (
                  <span className="ml-1.5">{getBadge(blog.author.total_points).icon}</span>
                )}
              </p>
              <p className="text-sm text-slate-500 break-words">
                {blog.author?.company_name && <span>{blog.author.company_name} · </span>}
                {format(new Date(blog.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-6 break-words">
            {blog.title}
          </h1>

          {blog.content && (
            <div className="mb-10 min-w-0 w-full max-w-full">
              <p
                className={`text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-w-full ${
                  !isExpanded && blog.content.length > 400 ? "line-clamp-[12]" : ""
                }`}
              >
                {blog.content}
              </p>
              {blog.content.length > 400 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-sky-600 hover:text-sky-700 font-medium text-sm"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 py-4 mb-10 border-t border-b border-slate-100 min-w-0">
            <button
              onClick={() => toggleLike(blog.id, blog.is_liked || false)}
              className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors shrink-0"
            >
              <Heart
                className={`h-5 w-5 ${blog.is_liked ? "fill-rose-500 text-rose-500" : ""}`}
              />
              <span>{blog.like_count ?? 0} likes</span>
            </button>
            <span className="flex items-center gap-2 text-slate-500 shrink-0">
              <MessageCircle className="h-5 w-5" />
              {blog.comment_count ?? 0} comments
            </span>
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Comments
            {blog.comment_count != null && (
              <span className="font-normal text-slate-500"> ({blog.comment_count})</span>
            )}
          </h2>
          <p className="text-sm text-slate-500 mb-6">Share your thoughts</p>
          <BlogCommentSection blogId={blog.id} />
        </div>
      </div>
    </SidebarLayout>
  );
}
