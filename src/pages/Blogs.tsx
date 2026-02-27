import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Image, Video, FileText, Heart, MessageCircle, Sparkles, Flame, Users } from "lucide-react";
import { toast } from "sonner";
import { CreateBlogModal } from "@/components/blogs/CreateBlogModal";
import { format } from "date-fns";
import { getBadge } from "@/utils/badgeSystem";
import { useNavigate } from "react-router-dom";

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

export default function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'image' | 'video'>('all');

  useEffect(() => {
    document.title = "Blogs | CFF Network";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Share insights and connect with fund managers through our community blog");
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (blogsError) throw blogsError;

      // Fetch author profiles and credits
      const userIds = [...new Set(blogsData?.map(blog => blog.user_id) || [])];
      const [profilesRes, creditsRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .in("id", userIds),
        supabase
          .from("user_credits")
          .select("user_id, total_points")
          .in("user_id", userIds)
      ]);

      // Fetch user likes
      let userLikes = new Set<string>();
      if (user) {
        const { data: likesData } = await supabase
          .from("blog_likes" as any)
          .select("blog_id")
          .eq("user_id", user.id);
        userLikes = new Set(likesData?.map((l: any) => l.blog_id) || []);
      }

      // Fetch like counts
      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("blog_id");
      const likeCountMap = new Map<string, number>();
      likeCounts?.forEach((like: any) => {
        likeCountMap.set(like.blog_id, (likeCountMap.get(like.blog_id) || 0) + 1);
      });

      // Fetch comment counts
      const { data: commentCounts } = await supabase
        .from("blog_comments")
        .select("blog_id");
      const commentCountMap = new Map<string, number>();
      commentCounts?.forEach((comment: any) => {
        commentCountMap.set(comment.blog_id, (commentCountMap.get(comment.blog_id) || 0) + 1);
      });

      const blogsWithAuthors = (blogsData?.map(blog => {
        const profile = profilesRes.data?.find(p => p.id === blog.user_id);
        const credit = creditsRes.data?.find(c => c.user_id === blog.user_id);
        return {
          ...blog,
          media_type: blog.media_type as 'text' | 'image' | 'video' | null,
          like_count: likeCountMap.get(blog.id) || 0,
          comment_count: commentCountMap.get(blog.id) || 0,
          is_liked: userLikes.has(blog.id),
          author: profile ? { ...profile, total_points: credit?.total_points || 0 } : undefined
        };
      }) || []) as Blog[];

      setBlogs(blogsWithAuthors);
    } catch (error: any) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
    
    // Listen for the create blog modal event from header
    const handleOpenModal = () => {
      setIsCreateModalOpen(true);
    };
    
    window.addEventListener('openCreateBlogModal', handleOpenModal);
    
    // Set up real-time subscriptions for live updates
    const subscriptions: any[] = [];

    // Subscribe to blogs table changes
    const blogsSubscription = supabase
      .channel('blogs-live-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blogs' },
        (payload) => {
          console.log('Blog change detected:', payload);
          // Refresh blogs when any change occurs
          fetchBlogs();
        }
      )
      .subscribe();

    // Subscribe to blog_likes table changes
    const likesSubscription = supabase
      .channel('blog-likes-live-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blog_likes' },
        (payload) => {
          console.log('Blog like change detected:', payload);
          // Update like counts in real-time
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            fetchBlogs(); // Refresh to get updated counts
          }
        }
      )
      .subscribe();

    // Subscribe to blog_comments table changes
    const commentsSubscription = supabase
      .channel('blog-comments-live-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blog_comments' },
        (payload) => {
          console.log('Blog comment change detected:', payload);
          // Update comment counts in real-time
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            fetchBlogs(); // Refresh to get updated counts
          }
        }
      )
      .subscribe();

    subscriptions.push(blogsSubscription, likesSubscription, commentsSubscription);
    
    return () => {
      window.removeEventListener('openCreateBlogModal', handleOpenModal);
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
    };
  }, [user, fetchBlogs]);

  const stats = useMemo(() => {
    const uniqueAuthors = new Set(blogs.map((blog) => blog.user_id));
    const totalEngagement = blogs.reduce((acc, blog) => acc + (blog.like_count || 0) + (blog.comment_count || 0), 0);

    return {
      totalPosts: blogs.length,
      totalAuthors: uniqueAuthors.size,
      totalEngagement,
    };
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (activeFilter === 'all') return blogs;
    return blogs.filter((blog) => blog.media_type === activeFilter);
  }, [blogs, activeFilter]);

  const filterOptions: Array<{ value: typeof activeFilter; label: string; description: string }> = useMemo(() => [
    { value: 'all', label: 'All posts', description: 'Latest updates across the community' },
    { value: 'text', label: 'Insights', description: 'Deep dives & written perspectives' },
    { value: 'image', label: 'Visuals', description: 'Infographics & portfolio highlights' },
    { value: 'video', label: 'Video', description: 'Founder stories & interviews' },
  ], []);

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) return;

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
      await fetchBlogs();
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

  const filteredEmpty = !loading && filteredBlogs.length === 0;
  const filterDescriptor = activeFilter === 'all'
    ? 'No stories yet. Be the first to share something inspiring!'
    : `No ${activeFilter} stories yet. Share one to spark the conversation.`;

  return (
    <SidebarLayout>
      <div className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-[url('/blogsbackground.jpeg')]">
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-3 py-6 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden">
          <div className="flex flex-col gap-4">
            {/* Stats Section */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-900/5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border-l-4 border-l-blue-500 border border-slate-200 bg-blue-50/30 px-3 py-2">
                  <p className="text-xs font-medium uppercase text-blue-600">Published</p>
                  <p className="mt-1 text-xl font-semibold text-blue-900">{stats.totalPosts.toLocaleString()}</p>
                  <p className="text-xs text-blue-600/70">Stories live on the feed</p>
                </div>
                <div className="rounded-lg border-l-4 border-l-purple-500 border border-slate-200 bg-purple-50/30 px-3 py-2">
                  <p className="text-xs font-medium uppercase text-purple-600">Contributors</p>
                  <p className="mt-1 text-xl font-semibold text-purple-900">{stats.totalAuthors.toLocaleString()}</p>
                  <p className="text-xs text-purple-600/70">Members sharing updates</p>
                </div>
                <div className="rounded-lg border-l-4 border-l-emerald-500 border border-slate-200 bg-emerald-50/30 px-3 py-2">
                  <p className="text-xs font-medium uppercase text-emerald-600">Engagement</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-900">{stats.totalEngagement.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600/70">Likes and comments</p>
                </div>
              </div>
            </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-900/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Filter by format</h2>
                <p className="text-xs text-slate-500">Quickly jump to the stories you want to see.</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.map((option) => {
                  const isActive = activeFilter === option.value;
                  const colorClasses = {
                    'all': isActive ? 'bg-blue-600 text-white hover:bg-blue-500 border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50',
                    'text': isActive ? 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50',
                    'image': isActive ? 'bg-purple-600 text-white hover:bg-purple-500 border-purple-600' : 'border-slate-200 text-slate-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50',
                    'video': isActive ? 'bg-rose-600 text-white hover:bg-rose-500 border-rose-600' : 'border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50'
                  };
                  return (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={isActive ? 'default' : 'outline'}
                      className={`rounded-md px-2.5 py-1 text-xs transition-all ${colorClasses[option.value]}`}
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </section>

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="h-full rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse"
                >
                  <CardHeader className="space-y-1.5 p-3">
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100" />
                    </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <div className="h-28 rounded-lg bg-slate-100" />
                    <div className="space-y-1">
                      <div className="h-2.5 rounded bg-slate-100" />
                      <div className="h-2.5 w-2/3 rounded bg-slate-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
          ) : filteredEmpty ? (
            <Card className="rounded-lg border border-slate-200 bg-white py-10 text-center shadow-md">
              <CardContent className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                  </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {activeFilter === 'all' ? 'No stories yet' : `No ${activeFilter} stories yet`}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {filterDescriptor}
                </p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                  size="sm"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
                  >
                  <PlusCircle className="h-3 w-3" />
                  Share a perspective
                  </Button>
                </CardContent>
              </Card>
            ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBlogs.map((blog) => {
                const cardColors = {
                  'image': {
                    border: 'border-purple-300 hover:border-purple-400',
                    bg: 'bg-gradient-to-br from-purple-50/80 to-pink-50/80',
                    accent: 'text-purple-600',
                    hover: 'group-hover:text-purple-700',
                    badge: 'border-purple-300 bg-purple-100 text-purple-700'
                  },
                  'video': {
                    border: 'border-rose-300 hover:border-rose-400',
                    bg: 'bg-gradient-to-br from-rose-50/80 to-orange-50/80',
                    accent: 'text-rose-600',
                    hover: 'group-hover:text-rose-700',
                    badge: 'border-rose-300 bg-rose-100 text-rose-700'
                  },
                  'text': {
                    border: 'border-indigo-300 hover:border-indigo-400',
                    bg: 'bg-gradient-to-br from-indigo-50/80 to-blue-50/80',
                    accent: 'text-indigo-600',
                    hover: 'group-hover:text-indigo-700',
                    badge: 'border-indigo-300 bg-indigo-100 text-indigo-700'
                  }
                };
                const colors = cardColors[blog.media_type || 'text'];
                
                return (
                  <Card 
                    key={blog.id} 
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 ${colors.border} ${colors.bg} shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <CardHeader className="pb-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm flex-shrink-0">
                            <AvatarImage src={blog.author?.profile_picture_url || ""} />
                            <AvatarFallback className={`bg-gradient-to-br ${
                              blog.media_type === 'image' ? 'from-purple-500 to-pink-500' :
                              blog.media_type === 'video' ? 'from-rose-500 to-orange-500' :
                              'from-indigo-500 to-blue-500'
                            } text-white text-xs`}>
                              {blog.author?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold text-slate-900 truncate">{blog.author?.full_name || "Unknown"}</p>
                              {blog.author?.total_points !== undefined && (
                                <span className="text-sm flex-shrink-0">
                                  {getBadge(blog.author.total_points).icon}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-600 truncate">{blog.author?.company_name || 'Member'}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`flex items-center gap-1 rounded-md border text-[10px] px-1.5 py-0.5 font-medium flex-shrink-0 ${colors.badge}`}
                        >
                          {getMediaIcon(blog.media_type)}
                          <span className="hidden sm:inline">{blog.media_type || "text"}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-0">
                      {(blog.media_type === "image" || blog.media_type === "video") && blog.media_url && (
                        <div className="relative h-32 overflow-hidden rounded-md border border-white/50">
                          {blog.media_type === "image" ? (
                          <img 
                            src={blog.media_url} 
                            alt={blog.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                          <video 
                            src={blog.media_url}
                            muted
                            loop
                            playsInline
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <p className={`text-[10px] font-medium uppercase tracking-wider ${colors.accent}`}>
                          {format(new Date(blog.created_at), "MMM d, yyyy")}
                        </p>
                        <h2 className={`text-sm font-semibold leading-tight text-slate-900 transition-colors line-clamp-2 ${colors.hover}`}>
                          {blog.title}
                        </h2>
                      {blog.caption && (
                          <p className="text-[10px] italic text-slate-600 line-clamp-1">
                            "{blog.caption}"
                        </p>
                      )}
                      {blog.content && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {blog.content}
                          </p>
                      )}
                      </div>
                      <div className="mt-auto flex items-center gap-3 border-t border-white/50 pt-2.5 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(blog.id, blog.is_liked || false);
                          }}
                          className="flex items-center gap-1 font-medium transition-colors hover:text-rose-500"
                        >
                          <Heart className={`h-3.5 w-3.5 transition-all ${blog.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-500 group-hover:text-rose-400'}`} />
                          <span className="text-[11px]">{blog.like_count}</span>
                        </button>
                        <div className="flex items-center gap-1 font-medium text-slate-500">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="text-[11px]">{blog.comment_count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}

            <CreateBlogModal
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
              onSuccess={fetchBlogs}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
