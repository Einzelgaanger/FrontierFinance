import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Image, Video, FileText, Heart, ArrowLeft, Loader2, Share2, Bookmark } from "lucide-react";
import { BlogCommentSection } from "@/components/blogs/BlogCommentSection";
import { getBadge } from "@/utils/badgeSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_type: 'text' | 'image' | 'video' | null;
  media_url: string | null;
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

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (blogError) throw blogError;

      // Fetch author profile and credits
      const [profileRes, creditRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .eq("id", blogData.user_id)
          .single(),
        supabase
          .from("user_credits")
          .select("total_points")
          .eq("user_id", blogData.user_id)
          .single()
      ]);

      // Fetch user like status
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

      // Fetch like count
      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("*")
        .eq("blog_id", blogData.id);
      const likeCount = likeCounts?.length || 0;

      // Fetch comment count
      const { data: commentCounts } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_id", blogData.id);
      const commentCount = commentCounts?.length || 0;

      const fullBlog: Blog = {
        ...blogData,
        media_type: blogData.media_type as 'text' | 'image' | 'video' | null,
        like_count: likeCount,
        comment_count: commentCount,
        is_liked: isLiked,
        author: profileRes.data ? { 
          ...profileRes.data, 
          total_points: creditRes.data?.total_points || 0 
        } : undefined
      };

      setBlog(fullBlog);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      toast.error("Failed to load blog post");
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("blog_likes" as any)
          .delete()
          .eq("blog_id", blogId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("blog_likes" as any)
          .insert({ blog_id: blogId, user_id: user.id });
      }
      await fetchBlog();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const getMediaIcon = (type: string | null) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </SidebarLayout>
    );
  }

  if (!blog) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold text-slate-800">We couldn&apos;t find that post</h1>
            <Button size="sm" onClick={() => navigate('/blogs')}>
              Back to Blogs
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1 text-sm text-slate-600 hover:border-slate-200 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to feed
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-white"
              >
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-slate-100 bg-slate-900 text-slate-100">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border border-white/40">
                    <AvatarImage src={blog.author?.profile_picture_url || ""} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {blog.author?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {blog.author?.full_name || "Unknown"}
                      </h3>
                      {blog.author?.total_points !== undefined && (
                        <span className="text-xl">
                          {getBadge(blog.author.total_points).icon}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300">{blog.author?.company_name || 'Community member'}</p>
                    <p className="text-xs text-slate-400">
                      {format(new Date(blog.created_at), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>
                </div>
                <Badge className="flex items-center gap-1 rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
                  {getMediaIcon(blog.media_type)}
                  {blog.media_type || "text"}
                </Badge>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-blue-500/80">
                  FEATURED STORY
                </span>
                <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                  {blog.title}
                </h1>
              </div>

              {(blog.media_type === "image" || blog.media_type === "video") && blog.media_url && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  {blog.media_type === "image" ? (
                    <img
                      src={blog.media_url}
                      alt={blog.title}
                      className="max-h-[520px] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      src={blog.media_url}
                      controls
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}

              {blog.caption && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm italic text-blue-800">
                  {blog.caption}
                </div>
              )}

              {blog.content && (
                <article className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{blog.content}</p>
                </article>
              )}

              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <button
                  onClick={() => toggleLike(blog.id, blog.is_liked || false)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-white hover:text-rose-500"
                >
                  <Heart className={`h-5 w-5 transition ${blog.is_liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{blog.like_count} {blog.like_count === 1 ? 'like' : 'likes'}</span>
                </button>
                <span className="inline-flex items-center gap-2 rounded-md px-3 py-1.5">
                  Comments · {blog.comment_count}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Comments</h3>
              </div>
              <BlogCommentSection blogId={blog.id} />
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}


