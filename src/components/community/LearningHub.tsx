import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  Filter,
  PlusCircle,
  Play,
  ExternalLink,
  Users,
  Briefcase,
  Scale,
  Target,
  Leaf,
  Handshake,
  LayoutGrid,
  List
} from "lucide-react";
import { toast } from "sonner";
import { CreateLearningResourceModal } from "./CreateLearningResourceModal";
import { format } from "date-fns";

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
  general: { label: 'General', icon: BookOpen, color: 'bg-slate-500' },
  fundraising: { label: 'Fundraising', icon: TrendingUp, color: 'bg-emerald-500' },
  operations: { label: 'Operations', icon: Briefcase, color: 'bg-blue-500' },
  legal: { label: 'Legal & Compliance', icon: Scale, color: 'bg-purple-500' },
  investment: { label: 'Investment', icon: Target, color: 'bg-orange-500' },
  impact: { label: 'Impact', icon: Leaf, color: 'bg-green-500' },
  networking: { label: 'Networking', icon: Handshake, color: 'bg-pink-500' },
};

const typeConfig = {
  article: { label: 'Article', icon: FileText },
  video: { label: 'Video', icon: Video },
  document: { label: 'Document', icon: FileText },
  webinar: { label: 'Webinar', icon: Presentation },
  course: { label: 'Course', icon: GraduationCap },
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
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

    return (
      <Card 
        onClick={() => handleResourceClick(resource)}
        className={`group cursor-pointer border transition-all duration-200 hover:shadow-lg ${
          featured 
            ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white' 
            : 'border-slate-200 hover:border-slate-300'
        } ${resource.resource_url ? '' : 'cursor-default'}`}
      >
        <CardContent className="p-0">
          {/* Thumbnail */}
          {resource.thumbnail_url ? (
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              <img 
                src={resource.thumbnail_url} 
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {resource.resource_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="p-3 rounded-full bg-white/90 shadow-lg">
                    <Play className="h-6 w-6 text-slate-900" />
                  </div>
                </div>
              )}
              {featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500 text-white border-0 gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className={`aspect-video w-full flex items-center justify-center ${categoryInfo.color} relative`}>
              <CategoryIcon className="h-12 w-12 text-white/80" />
              {featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500 text-white border-0 gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="p-4">
            {/* Category & Type */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs gap-1">
                <CategoryIcon className="h-3 w-3" />
                {categoryInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-xs gap-1">
                <TypeIcon className="h-3 w-3" />
                {typeConfig[resource.resource_type]?.label}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {resource.title}
            </h3>

            {/* Description */}
            {resource.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                {resource.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {resource.duration_minutes && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {resource.duration_minutes} min
                  </span>
                )}
                <Badge variant="outline" className={`text-xs capitalize ${difficultyColors[resource.difficulty_level]}`}>
                  {resource.difficulty_level}
                </Badge>
              </div>
              {resource.resource_url && (
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">Total Resources</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-100 uppercase tracking-wide">Articles</p>
                <p className="text-2xl font-bold mt-1">{stats.articles}</p>
              </div>
              <FileText className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-rose-100 uppercase tracking-wide">Videos</p>
                <p className="text-2xl font-bold mt-1">{stats.videos}</p>
              </div>
              <Video className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Courses</p>
                <p className="text-2xl font-bold mt-1">{stats.courses}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {Object.entries(typeConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                >
                  <LayoutGrid className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                >
                  <List className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              {/* Admin: Add Resource */}
              {userRole === 'admin' && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Resource
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded bg-slate-200" />
                    <div className="h-5 w-14 rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No resources found</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                ? "Try adjusting your filters or search query."
                : "Learning resources will appear here once added by administrators."}
            </p>
            {userRole === 'admin' && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Featured Section */}
          {featuredResources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900">Featured Resources</h2>
              </div>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
                <h2 className="text-lg font-semibold text-slate-900 mb-4">All Resources</h2>
              )}
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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