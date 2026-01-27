import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  Star,
  Filter,
  PlusCircle,
  Play,
  ExternalLink,
  LayoutGrid,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Heart,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CreateLearningResourceModal } from "./CreateLearningResourceModal";

interface LearningResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  resource_type?: string;
  category?: string;
  topic?: string | null;
  topic_other?: string | null;
  media_type?: 'link' | 'image' | 'video' | null;
  thumbnail_url: string | null;
  resource_url: string | null;
  duration_minutes?: number | null;
  difficulty_level?: string | null;
  is_featured: boolean;
  created_at: string;
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
}

// Topics from Learning Lab (9 + other)
const topicConfig: Record<string, { label: string }> = {
  investment_thesis: { label: 'Investment thesis' },
  fund_economics: { label: 'Fund economics' },
  capital_raising: { label: 'Capital raising' },
  team: { label: 'Team' },
  track_record: { label: 'Track record' },
  investment_process: { label: 'Investment process' },
  operations: { label: 'Operations' },
  esg_impact: { label: 'ESG & Impact' },
  sme_support: { label: 'SME support' },
  other: { label: 'Other' },
};

// Legacy category fallback
const categoryConfig: Record<string, { label: string }> = {
  general: { label: 'General' },
  fundraising: { label: 'Fundraising' },
  operations: { label: 'Operations' },
  legal: { label: 'Legal' },
  investment: { label: 'Investment' },
  impact: { label: 'Impact' },
  networking: { label: 'Networking' },
};

const mediaTypeConfig = {
  link: { label: 'Link', icon: LinkIcon },
  image: { label: 'Image', icon: ImageIcon },
  video: { label: 'Video', icon: Video },
};

export function LearningHub() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchResources = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("learning_resources")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      const list = (data as LearningResource[]) || [];

      try {
        const ids = list.map((r) => r.id);
        const [likesRes, commentsRes] = await Promise.all([
          supabase.from("learning_resource_likes").select("resource_id, user_id").in("resource_id", ids),
          supabase.from("learning_resource_comments").select("resource_id").in("resource_id", ids),
        ]);
        const likeCountMap = new Map<string, number>();
        const userLiked = new Set<string>();
        (likesRes.data || []).forEach((row: { resource_id: string; user_id: string }) => {
          likeCountMap.set(row.resource_id, (likeCountMap.get(row.resource_id) || 0) + 1);
          if (user?.id === row.user_id) userLiked.add(row.resource_id);
        });
        const commentCountMap = new Map<string, number>();
        (commentsRes.data || []).forEach((row: { resource_id: string }) => {
          commentCountMap.set(row.resource_id, (commentCountMap.get(row.resource_id) || 0) + 1);
        });
        list.forEach((r) => {
          (r as LearningResource).like_count = likeCountMap.get(r.id) ?? 0;
          (r as LearningResource).comment_count = commentCountMap.get(r.id) ?? 0;
          (r as LearningResource).is_liked = userLiked.has(r.id);
        });
      } catch {
        list.forEach((r) => {
          (r as LearningResource).like_count = 0;
          (r as LearningResource).comment_count = 0;
          (r as LearningResource).is_liked = false;
        });
      }
      setResources(list);
    } catch (error: unknown) {
      toast.error("Failed to load resources");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const effectiveTopic = (r: LearningResource) => r.topic ?? r.category ?? 'other';
  const effectiveMediaType = (r: LearningResource): 'link' | 'image' | 'video' =>
    r.media_type ?? (r.resource_type === 'video' ? 'video' : 'link');

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (resource.topic_other?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const topic = effectiveTopic(resource);
    const mediaType = effectiveMediaType(resource);
    const matchesTopic = selectedTopic === 'all' || topic === selectedTopic;
    const matchesMedia = selectedMediaType === 'all' || mediaType === selectedMediaType;
    return matchesSearch && matchesTopic && matchesMedia;
  });

  const featuredResources = filteredResources.filter(r => r.is_featured);
  const regularResources = filteredResources.filter(r => !r.is_featured);

  const stats = {
    total: resources.length,
    links: resources.filter(r => effectiveMediaType(r) === 'link').length,
    images: resources.filter(r => effectiveMediaType(r) === 'image').length,
    videos: resources.filter(r => effectiveMediaType(r) === 'video').length,
  };

  const handleResourceClick = (resource: LearningResource) => {
    navigate(`/community/learning/${resource.id}`);
  };

  const ResourceCard = ({ resource, featured = false }: { resource: LearningResource; featured?: boolean }) => {
    const topic = effectiveTopic(resource);
    const mediaType = effectiveMediaType(resource);
    const topicLabel = topic === 'other' && resource.topic_other
      ? resource.topic_other
      : (topicConfig[topic]?.label ?? categoryConfig[resource.category ?? '']?.label ?? 'Learning');
    const MediaIcon = mediaTypeConfig[mediaType]?.icon ?? LinkIcon;
    const mediaLabel = mediaTypeConfig[mediaType]?.label ?? 'Link';
    const thumbOrMedia = resource.thumbnail_url ?? (mediaType === 'image' ? resource.resource_url : null);
    const isVideo = mediaType === 'video';

    return (
      <Card
        onClick={() => handleResourceClick(resource)}
        className={`group cursor-pointer border transition-all duration-150 hover:shadow-sm ${
          featured ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <CardContent className="p-0 overflow-hidden">
          {/* Media / thumbnail – same frame as detail (image and video) */}
          {thumbOrMedia ? (
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-lg border-b border-slate-200 bg-slate-100 relative">
              <img
                src={thumbOrMedia}
                alt={resource.title}
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors pointer-events-none">
                  <div className="p-2.5 rounded-full bg-white/90 shadow">
                    <Play className="h-5 w-5 text-slate-900" />
                  </div>
                </div>
              )}
              {featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500 text-white border-0 text-[10px] h-5 gap-1">
                    <Star className="h-2.5 w-2.5" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] w-full flex items-center justify-center rounded-t-lg border-b border-slate-200 bg-slate-200/60 relative">
              <MediaIcon className="h-10 w-10 text-slate-500" />
              {featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500 text-white border-0 text-[10px] h-5 gap-1">
                    <Star className="h-2.5 w-2.5" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="p-4 min-w-0">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-slate-200 text-slate-600 shrink-0">
                {topicLabel}
              </Badge>
              <Badge variant="secondary" className="text-[10px] h-5 gap-1 px-1.5 bg-slate-100 text-slate-600 shrink-0">
                <MediaIcon className="h-2.5 w-2.5" />
                {mediaLabel}
              </Badge>
            </div>
            <h3 className="font-medium text-slate-900 text-sm mb-1.5 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug break-words">
              {resource.title}
            </h3>
            {resource.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed break-words">
                {resource.description}
              </p>
            )}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className={`h-3.5 w-3.5 ${resource.is_liked ? "fill-red-500 text-red-500" : ""}`} />
                  {resource.like_count ?? 0} like{(resource.like_count ?? 0) !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {resource.comment_count ?? 0} comment{(resource.comment_count ?? 0) !== 1 ? "s" : ""}
                </span>
              </div>
              {resource.resource_url && (
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Compact Stats Row */}
      <div className="flex items-center gap-6 py-3 px-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <BookOpen className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500 ml-1.5">resources</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <LinkIcon className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.links}</span>
            <span className="text-xs text-slate-500 ml-1.5">links</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <ImageIcon className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.images}</span>
            <span className="text-xs text-slate-500 ml-1.5">images</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <Video className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.videos}</span>
            <span className="text-xs text-slate-500 ml-1.5">videos</span>
          </div>
        </div>
        {userRole === 'admin' && (
          <div className="ml-auto">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs font-medium"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Add resource
            </Button>
          </div>
        )}
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm border-slate-200"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="all">All topics</option>
            {Object.entries(topicConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="all">All media</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded overflow-hidden ml-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-slate-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              <List className="h-3.5 w-3.5 text-slate-600" />
            </button>
          </div>

          <span className="text-xs text-slate-400 ml-1">
            {filteredResources.length} {filteredResources.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={`grid gap-3 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse border-slate-200">
              <CardContent className="p-0">
                <div className="aspect-[16/10] bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 rounded bg-slate-100" />
                    <div className="h-5 w-12 rounded bg-slate-100" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <BookOpen className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">No resources found</h3>
          <p className="text-xs text-slate-500 mb-4">
            {searchQuery || selectedTopic !== 'all' || selectedMediaType !== 'all'
              ? "Try adjusting your filters."
              : "Resources will appear here once added."}
          </p>
          {userRole === 'admin' && (
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm" variant="outline" className="h-8 text-xs">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Add resource
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured Section */}
          {featuredResources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-900">Featured</h2>
              </div>
              <div className={`grid gap-3 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {featuredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Resources */}
          {regularResources.length > 0 && (
            <div>
              {featuredResources.length > 0 && (
                <h2 className="text-sm font-semibold text-slate-900 mb-3">All resources</h2>
              )}
              <div className={`grid gap-3 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {regularResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateLearningResourceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchResources}
      />
    </div>
  );
}