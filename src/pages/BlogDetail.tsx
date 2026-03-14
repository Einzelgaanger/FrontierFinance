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
import { useGamification } from "@/hooks/useGamification";
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
    company_logo_url: string | null;
    total_points?: number;
  };
  is_liked?: boolean;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackContentRead } = useGamification();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Track content read when blog loads
  useEffect(() => {
    if (id && user && blog) {
      trackContentRead('blog', id);
    }
  }, [id, user, blog?.id]);

  const fetchBlog = useCallback(async () => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (blogError) throw blogError;

      const [profileRes, creditRes, memberRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .eq("id", blogData.user_id)
          .single(),
        supabase.from("user_credits").select("total_points").eq("user_id", blogData.user_id).single(),
        supabase.from("company_members").select("company_user_id").eq("member_user_id", blogData.user_id).eq("is_active", true).maybeSingle(),
      ]);

      let companyLogoUrl: string | null = null;
      if (memberRes.data?.company_user_id) {
        const { data: cp } = await supabase
          .from("user_profiles")
          .select("profile_picture_url")
          .eq("id", memberRes.data.company_user_id)
          .single();
        companyLogoUrl = cp?.profile_picture_url || null;
      }

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
          ? { ...profileRes.data, total_points: creditRes.data?.total_points || 0, company_logo_url: companyLogoUrl || profileRes.data.profile_picture_url }
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
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center font-sans antialiased">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            <p className="text-xs text-slate-600">Loading update…</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!blog) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
          <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Community</span>
                  <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">Update</h1>
                  <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                  <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Post not found</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/blogs")} className="h-8 rounded-lg border-slate-200 text-navy-900 hover:border-gold-500/40 font-sans text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Back to updates
                </Button>
              </div>
            </div>
          </header>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex justify-center">
            <Button onClick={() => navigate("/blogs")} className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white shadow-finance font-sans text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to updates
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const hasMedia = (blog.media_type === "image" || blog.media_type === "video") && blog.media_url;

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Community</span>
                <h1 className="text-base sm:text-lg font-display font-normal text-navy-900 truncate">Update</h1>
                <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                <p className="text-[10px] text-slate-500 font-sans hidden sm:inline truncate">{blog.title}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/blogs")} className="h-8 rounded-lg border-slate-200 text-navy-900 hover:border-gold-500/40 font-sans text-xs shrink-0">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to updates
              </Button>
            </div>
          </div>
        </header>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-w-0 overflow-x-hidden">

          {hasMedia && (
            <div className="mb-6 sm:mb-8 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-slate-900 shadow-finance">
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

          <div className="flex items-center gap-3 mb-3 min-w-0">
            <Avatar className="h-9 w-9 shrink-0 border border-slate-200/90">
              <AvatarImage src={blog.author?.profile_picture_url || ""} />
              <AvatarFallback className="bg-slate-100 text-navy-900 text-xs font-medium">
                {blog.author?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-navy-900 break-words text-sm">
                {blog.author?.full_name || "Author"}
                {blog.author?.total_points !== undefined && (
                  <span className="ml-1.5">{getBadge(blog.author.total_points).icon}</span>
                )}
              </p>
              <p className="text-[10px] text-slate-500 break-words flex items-center gap-1.5 font-sans">
                {blog.author?.company_logo_url && (
                  <Avatar className="h-3.5 w-3.5 border border-slate-200 inline-flex">
                    <AvatarImage src={blog.author.company_logo_url} className="object-cover" />
                    <AvatarFallback className="text-[6px] bg-slate-100">{blog.author?.company_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                {blog.author?.company_name && <span>{blog.author.company_name} · </span>}
                {format(new Date(blog.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-display font-normal text-navy-900 tracking-tight leading-tight mb-5 break-words">
            {blog.title}
          </h1>

          {blog.content && (
            <div className="mb-8 min-w-0 w-full max-w-full rounded-xl border border-slate-200/90 bg-white shadow-finance p-4 sm:p-5">
              <p
                className={`text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-w-full text-sm ${
                  !isExpanded && blog.content.length > 400 ? "line-clamp-[12]" : ""
                }`}
              >
                {blog.content}
              </p>
              {blog.content.length > 400 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-gold-600 hover:text-gold-700 font-sans font-medium text-xs"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 py-3 mb-8 border-t border-b border-slate-200/80 min-w-0">
            <button
              onClick={() => toggleLike(blog.id, blog.is_liked || false)}
              className="flex items-center gap-2 text-slate-600 hover:text-gold-600 transition-colors shrink-0 font-sans text-sm"
            >
              <Heart
                className={`h-4 w-4 ${blog.is_liked ? "fill-gold-500 text-gold-500" : ""}`}
              />
              <span>{blog.like_count ?? 0} likes</span>
            </button>
            <span className="flex items-center gap-2 text-slate-500 shrink-0 font-sans text-sm">
              <MessageCircle className="h-4 w-4" />
              {blog.comment_count ?? 0} comments
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Discussion</span>
            <h2 className="text-base font-display font-normal text-navy-900">
              Comments
              {blog.comment_count != null && (
                <span className="font-sans font-normal text-slate-500 text-sm"> ({blog.comment_count})</span>
              )}
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 mb-4 font-sans">Share your thoughts</p>
          <BlogCommentSection blogId={blog.id} />
        </div>
      </div>
    </SidebarLayout>
  );
}
