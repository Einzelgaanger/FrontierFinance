import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Image, 
  Video, 
  FileText, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Users,
  Activity,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { CreateBlogModal } from "@/components/blogs/CreateBlogModal";
import { BlogDetailModal } from "@/components/blogs/BlogDetailModal";
import { format } from "date-fns";
import { getBadge } from "@/utils/badgeSystem";

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

export function BlogFeed() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'image' | 'video'>('all');

  const fetchBlogs = useCallback(async () => {
    try {
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (blogsError) throw blogsError;

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

      let userLikes = new Set<string>();
      if (user) {
        const { data: likesData } = await supabase
          .from("blog_likes" as any)
          .select("blog_id")
          .eq("user_id", user.id);
        userLikes = new Set(likesData?.map((l: any) => l.blog_id) || []);
      }

      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("blog_id");
      const likeCountMap = new Map<string, number>();
      likeCounts?.forEach((like: any) => {
        likeCountMap.set(like.blog_id, (likeCountMap.get(like.blog_id) || 0) + 1);
      });

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
      toast.error("Failed to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }

    const handleOpenModal = () => setIsCreateModalOpen(true);
    window.addEventListener('openCreateBlogModal', handleOpenModal);

    const blogsChannel = supabase
      .channel('blogs-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchBlogs)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_likes' }, fetchBlogs)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_comments' }, fetchBlogs)
      .subscribe();

    return () => {
      window.removeEventListener('openCreateBlogModal', handleOpenModal);
      supabase.removeChannel(blogsChannel);
    };
  }, [user, fetchBlogs]);

  const stats = useMemo(() => ({
    totalPosts: blogs.length,
    totalAuthors: new Set(blogs.map(b => b.user_id)).size,
    totalEngagement: blogs.reduce((acc, b) => acc + (b.like_count || 0) + (b.comment_count || 0), 0),
  }), [blogs]);

  const filteredBlogs = useMemo(() => {
    if (activeFilter === 'all') return blogs;
    return blogs.filter((blog) => blog.media_type === activeFilter);
  }, [blogs, activeFilter]);

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) return;
    try {
      if (isLiked) {
        await supabase.from("blog_likes" as any).delete().eq("blog_id", blogId).eq("user_id", user.id);
      } else {
        await supabase.from("blog_likes" as any).insert({ blog_id: blogId, user_id: user.id });
      }
      await fetchBlogs();
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const getMediaIcon = (type: string | null) => {
    switch (type) {
      case "image": return <Image className="h-3 w-3" />;
      case "video": return <Video className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getMediaLabel = (type: string | null) => {
    switch (type) {
      case "image": return "Image";
      case "video": return "Video";
      default: return "Article";
    }
  };

  const filterOptions = [
    { value: 'all' as const, label: 'All updates' },
    { value: 'text' as const, label: 'Articles' },
    { value: 'image' as const, label: 'Images' },
    { value: 'video' as const, label: 'Videos' },
  ];

  return (
    <div className="space-y-5">
      {/* Compact Stats Row */}
      <div className="flex items-center gap-6 py-3 px-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <FileText className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.totalPosts}</span>
            <span className="text-xs text-slate-500 ml-1.5">posts</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <Users className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.totalAuthors}</span>
            <span className="text-xs text-slate-500 ml-1.5">contributors</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <Activity className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.totalEngagement}</span>
            <span className="text-xs text-slate-500 ml-1.5">interactions</span>
          </div>
        </div>
        <div className="ml-auto">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white h-8 px-3 text-xs font-medium"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            New post
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5">
        <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === option.value 
                ? "bg-slate-900 text-white" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-2">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-2.5 w-16 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-100" />
                <div className="h-3 w-full rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">No posts yet</h3>
          <p className="text-xs text-slate-500 mb-4">
            Be the first to share your insights.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" variant="outline" className="h-8 text-xs">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Create post
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => {
            const badge = blog.author?.total_points ? getBadge(blog.author.total_points) : null;
            
            return (
              <Card 
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-150 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Media Preview */}
                  {blog.media_type === 'image' && blog.media_url && (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50">
                      <img 
                        src={blog.media_url} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                  )}
                  {blog.media_type === 'video' && blog.media_url && (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900 relative">
                      <video src={blog.media_url} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-2.5 rounded-full bg-white/90 shadow">
                          <Video className="h-5 w-5 text-slate-900" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Author Row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={blog.author?.profile_picture_url || ""} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">
                          {blog.author?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {blog.author?.full_name || "Unknown"}
                          </p>
                          {badge && <span className="text-xs">{badge.icon}</span>}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {blog.author?.company_name || ""}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] gap-1 h-5 px-1.5 bg-slate-100 text-slate-600 shrink-0">
                        {getMediaIcon(blog.media_type)}
                        {getMediaLabel(blog.media_type)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-slate-900 text-sm mb-1.5 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    {/* Content Preview */}
                    {blog.content && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {blog.content}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(blog.id, blog.is_liked || false);
                          }}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-3.5 w-3.5 ${blog.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{blog.like_count}</span>
                        </button>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{blog.comment_count}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </span>
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

      <BlogDetailModal
        blog={selectedBlog}
        open={!!selectedBlog}
        onOpenChange={(open) => !open && setSelectedBlog(null)}
        onToggleLike={toggleLike}
      />
    </div>
  );
}