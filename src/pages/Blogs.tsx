import { useState, useEffect, useMemo } from "react";
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

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
    
    // Listen for the create blog modal event from header
    const handleOpenModal = () => {
      setIsCreateModalOpen(true);
    };
    
    window.addEventListener('openCreateBlogModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openCreateBlogModal', handleOpenModal);
    };
  }, [user]);

  const fetchBlogs = async () => {
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
  };

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
      <div className="relative min-h-screen bg-slate-50">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-slate-900 via-blue-900 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Community Stories
                </span>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Fresh insights from across the Frontier Finance Network.
                </h1>
                <p className="text-sm text-slate-500">
                  Catch up on what members are sharing today—and add your own update in just a few clicks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-500"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  New post
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-md border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
                  onClick={() => window.scrollTo({ top: 420, behavior: 'smooth' })}
                >
                  Browse feed
                </Button>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase text-slate-500">Published</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.totalPosts.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Stories live on the feed</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase text-slate-500">Contributors</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.totalAuthors.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Members sharing updates</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase text-slate-500">Engagement</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.totalEngagement.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Likes and comments</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Filter by format</h2>
                <p className="text-xs text-slate-500">Quickly jump to the stories you want to see.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => {
                  const isActive = activeFilter === option.value;
                  return (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={isActive ? 'default' : 'outline'}
                      className={`rounded-md px-3 py-1 text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="h-full rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse"
                >
                  <CardHeader className="space-y-2">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-32 rounded-lg bg-slate-100" />
                    <div className="space-y-1.5">
                      <div className="h-3 rounded bg-slate-100" />
                      <div className="h-3 w-2/3 rounded bg-slate-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
          ) : filteredEmpty ? (
            <Card className="rounded-xl border border-slate-200 bg-white py-14 text-center shadow-md">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FileText className="h-7 w-7" />
                  </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {activeFilter === 'all' ? 'No stories yet' : `No ${activeFilter} stories yet`}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {filterDescriptor}
                </p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                  size="sm"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                  >
                  <PlusCircle className="h-4 w-4" />
                  Share a perspective
                  </Button>
                </CardContent>
              </Card>
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBlogs.map((blog) => {
                return (
                  <Card 
                    key={blog.id} 
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarImage src={blog.author?.profile_picture_url || ""} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {blog.author?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{blog.author?.full_name || "Unknown"}</p>
                              {blog.author?.total_points !== undefined && (
                                <span className="text-lg">
                                  {getBadge(blog.author.total_points).icon}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{blog.author?.company_name || 'Community member'}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 text-blue-700"
                        >
                          {getMediaIcon(blog.media_type)}
                          {blog.media_type || "text"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pb-5">
                      {(blog.media_type === "image" || blog.media_type === "video") && blog.media_url && (
                        <div className="relative h-44 overflow-hidden rounded-lg">
                          {blog.media_type === "image" ? (
                          <img 
                            src={blog.media_url} 
                            alt={blog.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                          <video 
                            src={blog.media_url}
                            muted
                            loop
                            playsInline
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-slate-900/5 to-transparent" />
                          {blog.author?.company_name && (
                            <Badge className="absolute left-3 top-3 rounded-md bg-white/90 text-blue-900 backdrop-blur">
                              {blog.author.company_name}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-500/80">
                          {format(new Date(blog.created_at), "MMM d, yyyy")}
                        </p>
                        <h2 className="text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700 line-clamp-2">
                          {blog.title}
                        </h2>
                      {blog.caption && (
                          <p className="text-sm italic text-slate-500 line-clamp-2">
                            “{blog.caption}”
                        </p>
                      )}
                      {blog.content && (
                          <p className="text-sm text-slate-600 line-clamp-3">
                            {blog.content}
                          </p>
                      )}
                      </div>
                      <div className="mt-auto flex items-center gap-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(blog.id, blog.is_liked || false);
                          }}
                          className="flex items-center gap-1.5 font-medium transition-colors hover:text-rose-500"
                        >
                          <Heart className={`h-4 w-4 transition-all ${blog.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover:text-rose-400'}`} />
                          {blog.like_count}
                        </button>
                        <div className="flex items-center gap-1.5 font-medium">
                          <MessageCircle className="h-4 w-4" />
                          {blog.comment_count}
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
      </SidebarLayout>
  );
}
