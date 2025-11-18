import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Image, Video, FileText, Heart, ArrowLeft, Loader2, Share2, Bookmark, MessageCircle } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

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
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/blogs')}
              className="h-9 w-9 rounded-full p-0 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-bold text-slate-900">Post</h2>
          </div>

          {/* Main Post - Two Column Layout */}
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-slate-200 pb-6">
            {/* Left Column - Content */}
            <div className="flex flex-col space-y-4">
              {/* Author Header */}
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border border-slate-200 flex-shrink-0">
                  <AvatarImage src={blog.author?.profile_picture_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {blog.author?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">
                      {blog.author?.full_name || "Unknown"}
                    </p>
                    {blog.author?.total_points !== undefined && (
                      <span className="text-base">
                        {getBadge(blog.author.total_points).icon}
                      </span>
                    )}
                    <span className="text-sm text-slate-500">·</span>
                    <span className="text-sm text-slate-500">
                      {format(new Date(blog.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {blog.author?.company_name || 'Community member'}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {blog.title}
              </h1>

              {/* Content with Read More/Less */}
              <div className="space-y-3">
                {blog.content && (
                  <div>
                    <p className={`text-[15px] text-slate-900 leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-6' : ''}`}>
                      {blog.content}
                    </p>
                    {blog.content.length > 300 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                {blog.caption && (
                  <p className="text-[15px] text-slate-600 italic leading-relaxed">
                    "{blog.caption}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => toggleLike(blog.id, blog.is_liked || false)}
                  className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group/action"
                >
                  <div className={`p-2 rounded-full transition-colors ${blog.is_liked ? 'bg-rose-50' : 'group-hover/action:bg-rose-50'}`}>
                    <Heart className={`h-5 w-5 transition-all ${blog.is_liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </div>
                  <span className="text-sm font-medium">{blog.like_count || 0}</span>
                </button>
                <button 
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  className={`flex items-center gap-2 transition-colors group/action ${isCommentsOpen ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
                >
                  <div className={`p-2 rounded-full transition-colors ${isCommentsOpen ? 'bg-blue-50' : 'group-hover/action:bg-blue-50'}`}>
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{blog.comment_count || 0}</span>
                </button>
                <button 
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group/action"
                  aria-label="Share post"
                >
                  <div className="p-2 rounded-full transition-colors group-hover/action:bg-blue-50">
                    <Share2 className="h-5 w-5" />
                  </div>
                </button>
                <button 
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group/action"
                  aria-label="Save post"
                >
                  <div className="p-2 rounded-full transition-colors group-hover/action:bg-blue-50">
                    <Bookmark className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {/* Comments Section - Toggleable */}
              {isCommentsOpen && (
                <div className="pt-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Comments ({blog.comment_count || 0})</h3>
                  <BlogCommentSection blogId={blog.id} />
                </div>
              )}
            </div>

            {/* Right Column - Media */}
            {(blog.media_type === "image" || blog.media_type === "video") && blog.media_url && (
              <div className="sticky top-6 h-fit">
                <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {blog.media_type === "image" ? (
                    <img
                      src={blog.media_url}
                      alt={blog.title}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <video
                      src={blog.media_url}
                      controls
                      className="w-full h-auto"
                    />
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </SidebarLayout>
  );
}


