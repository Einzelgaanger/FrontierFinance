import { useState, useEffect, useCallback } from "react";
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
  Presentation,
  GraduationCap,
  Search,
  Clock,
  Star,
  Filter,
  PlusCircle,
  Play,
  ExternalLink,
  Briefcase,
  Scale,
  Target,
  Leaf,
  Handshake,
  LayoutGrid,
  List,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { CreateLearningResourceModal } from "./CreateLearningResourceModal";

interface LearningResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  resource_type: 'article' | 'video' | 'document' | 'webinar' | 'course';
  category: 'general' | 'fundraising' | 'operations' | 'legal' | 'investment' | 'impact' | 'networking';
  thumbnail_url: string | null;
  resource_url: string | null;
  duration_minutes: number | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_featured: boolean;
  created_at: string;
}

const categoryConfig = {
  general: { label: 'General', icon: BookOpen, color: 'bg-slate-600' },
  fundraising: { label: 'Fundraising', icon: TrendingUp, color: 'bg-emerald-600' },
  operations: { label: 'Operations', icon: Briefcase, color: 'bg-blue-600' },
  legal: { label: 'Legal', icon: Scale, color: 'bg-purple-600' },
  investment: { label: 'Investment', icon: Target, color: 'bg-orange-600' },
  impact: { label: 'Impact', icon: Leaf, color: 'bg-green-600' },
  networking: { label: 'Networking', icon: Handshake, color: 'bg-pink-600' },
};

const typeConfig = {
  article: { label: 'Article', icon: FileText },
  video: { label: 'Video', icon: Video },
  document: { label: 'Document', icon: FileText },
  webinar: { label: 'Webinar', icon: Presentation },
  course: { label: 'Course', icon: GraduationCap },
};

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'bg-green-50 text-green-700 border-green-200' },
  intermediate: { label: 'Intermediate', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced: { label: 'Advanced', class: 'bg-red-50 text-red-700 border-red-200' },
};

export function LearningHub() {
  const { userRole } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
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
      setResources(data as LearningResource[] || []);
    } catch (error: any) {
      toast.error("Failed to load resources");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.resource_type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.is_featured);
  const regularResources = filteredResources.filter(r => !r.is_featured);

  const stats = {
    total: resources.length,
    articles: resources.filter(r => r.resource_type === 'article').length,
    videos: resources.filter(r => r.resource_type === 'video').length,
    courses: resources.filter(r => r.resource_type === 'course').length,
  };

  const handleResourceClick = (resource: LearningResource) => {
    if (resource.resource_url) {
      window.open(resource.resource_url, '_blank');
    }
  };

  const ResourceCard = ({ resource, featured = false }: { resource: LearningResource; featured?: boolean }) => {
    const TypeIcon = typeConfig[resource.resource_type]?.icon || FileText;
    const CategoryIcon = categoryConfig[resource.category]?.icon || BookOpen;
    const categoryInfo = categoryConfig[resource.category];
    const difficultyInfo = difficultyConfig[resource.difficulty_level];

    return (
      <Card 
        onClick={() => handleResourceClick(resource)}
        className={`group cursor-pointer border transition-all duration-150 hover:shadow-sm ${
          featured ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 hover:border-slate-300'
        } ${resource.resource_url ? '' : 'cursor-default'}`}
      >
        <CardContent className="p-0">
          {/* Thumbnail */}
          {resource.thumbnail_url ? (
            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50 relative">
              <img 
                src={resource.thumbnail_url} 
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              />
              {resource.resource_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
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
            <div className={`aspect-[16/10] w-full flex items-center justify-center ${categoryInfo.color} relative`}>
              <CategoryIcon className="h-10 w-10 text-white/70" />
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

          <div className="p-4">
            {/* Category & Type Badges */}
            <div className="flex items-center gap-1.5 mb-2">
              <Badge variant="outline" className="text-[10px] h-5 gap-1 px-1.5 border-slate-200 text-slate-600">
                <CategoryIcon className="h-2.5 w-2.5" />
                {categoryInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-[10px] h-5 gap-1 px-1.5 bg-slate-100 text-slate-600">
                <TypeIcon className="h-2.5 w-2.5" />
                {typeConfig[resource.resource_type]?.label}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-medium text-slate-900 text-sm mb-1.5 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
              {resource.title}
            </h3>

            {/* Description */}
            {resource.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {resource.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {resource.duration_minutes && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    {resource.duration_minutes} min
                  </span>
                )}
                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 capitalize ${difficultyInfo.class}`}>
                  {difficultyInfo.label}
                </Badge>
              </div>
              {resource.resource_url && (
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
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
            <FileText className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.articles}</span>
            <span className="text-xs text-slate-500 ml-1.5">articles</span>
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
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-200/60 rounded">
            <GraduationCap className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900">{stats.courses}</span>
            <span className="text-xs text-slate-500 ml-1.5">courses</span>
          </div>
        </div>
        
        {userRole === 'admin' && (
          <div className="ml-auto">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white h-8 px-3 text-xs font-medium"
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="all">All categories</option>
            {Object.entries(categoryConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="all">All types</option>
            {Object.entries(typeConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
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
            {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
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