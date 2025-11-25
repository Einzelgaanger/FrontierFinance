import { useEffect, useState, useCallback } from "react";
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

  const fetchBlog = useCallback(async () => {
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
  }, [id, user, navigate]);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }

    // Set up real-time subscriptions for live updates
    const subscriptions: any[] = [];

    // Subscribe to blog_likes table changes for this specific blog
    const likesSubscription = supabase
      .channel(`blog-likes-${id}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'blog_likes',
          filter: `blog_id=eq.${id}`
        },
        (payload) => {
          console.log('Blog like change detected:', payload);
          // Refresh blog to get updated like count
          fetchBlog();
        }
      )
      .subscribe();

    // Subscribe to blog_comments table changes for this specific blog
    const commentsSubscription = supabase
      .channel(`blog-comments-${id}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'blog_comments',
          filter: `blog_id=eq.${id}`
        },
        (payload) => {
          console.log('Blog comment change detected:', payload);
          // Refresh blog to get updated comment count
          fetchBlog();
        }
      )
      .subscribe();

    subscriptions.push(likesSubscription, commentsSubscription);

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
    };
  }, [id, fetchBlog]);

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
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/blogs')}
              className="h-9 w-9 rounded-full p-0 hover:bg-slate-100 border border-slate-200 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium px-2.5 py-1">
                {getMediaIcon(blog.media_type)}
                <span className="ml-1.5 capitalize">{blog.media_type || "text"}</span>
              </Badge>
            </div>
          </div>

          {/* Main Post - Two Column Layout */}
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Left Column - Content */}
            <div className="flex flex-col space-y-5">
              {/* Author Header */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
                <Avatar className="h-14 w-14 border-2 border-slate-200 shadow-sm flex-shrink-0">
                  <AvatarImage src={blog.author?.profile_picture_url || ""} />
                  <AvatarFallback className="bg-slate-600 text-white font-semibold text-base">
                    {blog.author?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-slate-900">
                      {blog.author?.full_name || "Unknown"}
                    </p>
                    {blog.author?.total_points !== undefined && (
                      <span className="text-lg">
                        {getBadge(blog.author.total_points).icon}
                      </span>
                    )}
                    <span className="text-sm text-slate-400">·</span>
                    <span className="text-sm text-slate-500 font-medium">
                      {format(new Date(blog.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 font-medium">
                    {blog.author?.company_name || 'Community member'}
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                  {blog.title}
                </h1>
              </div>

              {/* Content with Read More/Less */}
              <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-4">
                {blog.content && (
                  <div>
                    <p className={`text-base text-slate-800 leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-6' : ''}`}>
                      {blog.content}
                    </p>
                    {blog.content.length > 300 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-md border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                {blog.caption && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-base text-slate-600 italic leading-relaxed">
                      "{blog.caption}"
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(blog.id, blog.is_liked || false)}
                    className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors group/action"
                  >
                    <div className={`p-2 rounded-lg transition-colors ${blog.is_liked ? 'bg-rose-50 border border-rose-200' : 'border border-slate-200 group-hover/action:bg-slate-50 group-hover/action:border-slate-300'}`}>
                      <Heart className={`h-5 w-5 transition-all ${blog.is_liked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                    </div>
                    <span className="text-sm font-medium">{blog.like_count || 0}</span>
                  </button>
                  <button 
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                    className={`flex items-center gap-2 transition-colors group/action ${isCommentsOpen ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                  >
                    <div className={`p-2 rounded-lg transition-colors border ${isCommentsOpen ? 'bg-blue-50 border-blue-200' : 'border-slate-200 group-hover/action:bg-slate-50 group-hover/action:border-slate-300'}`}>
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{blog.comment_count || 0}</span>
                  </button>
                  <button 
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-700 transition-colors group/action"
                    aria-label="Share post"
                  >
                    <div className="p-2 rounded-lg transition-colors border border-slate-200 group-hover/action:bg-slate-50 group-hover/action:border-slate-300">
                      <Share2 className="h-5 w-5" />
                    </div>
                  </button>
                  <button 
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-700 transition-colors group/action"
                    aria-label="Save post"
                  >
                    <div className="p-2 rounded-lg transition-colors border border-slate-200 group-hover/action:bg-slate-50 group-hover/action:border-slate-300">
                      <Bookmark className="h-5 w-5" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Comments Section - Toggleable */}
              {isCommentsOpen && (
                <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
                    Comments ({blog.comment_count || 0})
                  </h3>
                  <BlogCommentSection blogId={blog.id} />
                </div>
              )}
            </div>

            {/* Right Column - Media */}
            {(blog.media_type === "image" || blog.media_type === "video") && blog.media_url && (
              <div className="sticky top-6 h-fit">
                <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md p-2">
                  {blog.media_type === "image" ? (
                    <img
                      src={blog.media_url}
                      alt={blog.title}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={blog.media_url}
                      controls
                      className="w-full h-auto rounded-md"
                    />
                  )}
                </div>
                {blog.caption && (
                  <p className="mt-3 text-sm text-slate-600 italic text-center px-2">
                    {blog.caption}
                  </p>
                )}
              </div>
            )}
          </article>
        </div>
      </div>
    </SidebarLayout>
  );
}


