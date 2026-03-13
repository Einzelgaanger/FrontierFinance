import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Users,
  Activity,
  Filter,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateBlogModal } from "@/components/blogs/CreateBlogModal";
import { AttachmentDisplay } from "@/components/community/AttachmentDisplay";
import { format } from "date-fns";
import { getBadge } from "@/utils/badgeSystem";

interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_type: 'text' | 'image' | 'video' | null;
  media_url: string | null;
  thumbnail_url: string | null;
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
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const canCreatePost = userRole === 'member' || userRole === 'admin';

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

    const handleOpenModal = () => {
      if (canCreatePost) {
        setIsCreateModalOpen(true);
      }
    };
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
    let result = blogs;
    if (activeFilter !== 'all') {
      result = result.filter((blog) => blog.media_type === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(q) ||
          (blog.content?.toLowerCase().includes(q) ?? false) ||
          (blog.caption?.toLowerCase().includes(q) ?? false) ||
          blog.author?.full_name?.toLowerCase().includes(q) ||
          blog.author?.company_name?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [blogs, activeFilter, searchQuery]);

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
    <div className="space-y-3 min-w-0">
      {/* Compact Stats Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1 bg-slate-200/60 rounded">
            <FileText className="h-3 w-3 text-slate-600" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-semibold text-slate-900">{stats.totalPosts}</span>
            <span className="text-[11px] text-slate-500 ml-1">posts</span>
          </div>
        </div>
        <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1 bg-slate-200/60 rounded">
            <Users className="h-3 w-3 text-slate-600" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-semibold text-slate-900">{stats.totalAuthors}</span>
            <span className="text-[11px] text-slate-500 ml-1">contributors</span>
          </div>
        </div>
        <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1 bg-slate-200/60 rounded">
            <Activity className="h-3 w-3 text-slate-600" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-semibold text-slate-900">{stats.totalEngagement}</span>
            <span className="text-[11px] text-slate-500 ml-1">interactions</span>
          </div>
        </div>
        <div className="ml-auto shrink-0">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white h-7 px-2.5 text-[11px] font-medium"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            New post
          </Button>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
        <div className="relative flex-1 w-full sm:max-w-[200px] min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs border-slate-200 min-w-0"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <Filter className="h-3 w-3 text-slate-400 shrink-0" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-2 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                activeFilter === option.value 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
          <div className="flex border border-slate-200 rounded overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1 ${viewMode === 'grid' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3 w-3 text-slate-600" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1 ${viewMode === 'list' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              aria-label="List view"
            >
              <List className="h-3 w-3 text-slate-600" />
            </button>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className={`grid gap-2 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse border-slate-200">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-100" />
                  <div className="space-y-1 flex-1">
                    <div className="h-2.5 w-20 rounded bg-slate-100" />
                    <div className="h-2 w-14 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-3 w-3/4 rounded bg-slate-100" />
                <div className="h-2.5 w-full rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-10 text-center min-w-0">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-900 mb-0.5">
            {blogs.length === 0 ? "No posts yet" : "No posts match your search"}
          </h3>
          <p className="text-[11px] text-slate-500 mb-3 break-words">
            {blogs.length === 0
              ? "Be the first to share your insights."
              : "Try adjusting your search or filters."}
          </p>
          {blogs.length === 0 && (
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm" variant="outline" className="h-7 text-[11px]">
              <PlusCircle className="h-3 w-3 mr-1" />
              Create post
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-2 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredBlogs.map((blog) => {
            const badge = blog.author?.total_points ? getBadge(blog.author.total_points) : null;
            
            return (
              <Card 
                key={blog.id}
                onClick={() => navigate(`/blogs/${blog.id}`)}
                className="group cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-150 overflow-hidden"
              >
                <CardContent className="p-0 overflow-hidden">
                  {/* Media Preview */}
                  {(blog.media_type === "image" && blog.media_url) ||
                  (blog.media_type === "video" && (blog.thumbnail_url || blog.media_url)) ? (
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-t-md border-b border-slate-200 bg-slate-100 relative">
                      {blog.media_type === "image" ? (
                        <img
                          src={blog.media_url!}
                          alt={blog.title}
                          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      ) : blog.thumbnail_url ? (
                        <img
                          src={blog.thumbnail_url}
                          alt={blog.title}
                          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      ) : (
                        <video src={blog.media_url!} className="w-full h-full object-contain opacity-90" />
                      )}
                      {blog.media_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="p-1.5 rounded-full bg-white/90 shadow">
                            <Video className="h-4 w-4 text-slate-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="p-3 min-w-0">
                    {/* Author Row */}
                    <div className="flex items-center gap-2 mb-2 min-w-0">
                      <Avatar className="h-6 w-6 border border-slate-200 shrink-0">
                        <AvatarImage src={blog.author?.profile_picture_url || ""} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {blog.author?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <p className="text-xs font-medium text-slate-900 break-words">
                            {blog.author?.full_name || "Unknown"}
                          </p>
                          {badge && <span className="text-[10px] shrink-0">{badge.icon}</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 break-words truncate">
                          {blog.author?.company_name || ""}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] gap-0.5 h-4 px-1 bg-slate-100 text-slate-600 shrink-0">
                        {getMediaIcon(blog.media_type)}
                        {getMediaLabel(blog.media_type)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-slate-900 text-xs mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug break-words">
                      {blog.title}
                    </h3>

                    {/* Content Preview */}
                    {blog.content && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-snug break-words">
                        {blog.content}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(blog.id, blog.is_liked || false);
                          }}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-3 w-3 ${blog.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{blog.like_count} like{blog.like_count !== 1 ? 's' : ''}</span>
                        </button>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <MessageCircle className="h-3 w-3" />
                          <span>{blog.comment_count} comment{blog.comment_count !== 1 ? 's' : ''}</span>
                        </span>
                        <AttachmentDisplay blogId={blog.id} compact />
                      </div>
                      <span className="text-[10px] text-slate-400">
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
    </div>
  );
}