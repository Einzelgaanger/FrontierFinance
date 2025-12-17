import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, BookOpen, Video, FileText, Presentation, GraduationCap } from "lucide-react";

interface CreateLearningResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const resourceTypes = [
  { value: 'article', label: 'Article', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'webinar', label: 'Webinar', icon: Presentation },
  { value: 'course', label: 'Course', icon: GraduationCap },
];

const categories = [
  { value: 'general', label: 'General' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'operations', label: 'Operations' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'investment', label: 'Investment' },
  { value: 'impact', label: 'Impact' },
  { value: 'networking', label: 'Networking' },
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function CreateLearningResourceModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateLearningResourceModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    resource_type: "article",
    category: "general",
    thumbnail_url: "",
    resource_url: "",
    duration_minutes: "",
    difficulty_level: "beginner",
    is_featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("learning_resources").insert({
        title: formData.title,
        description: formData.description || null,
        content: formData.content || null,
        resource_type: formData.resource_type,
        category: formData.category,
        thumbnail_url: formData.thumbnail_url || null,
        resource_url: formData.resource_url || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        difficulty_level: formData.difficulty_level,
        is_featured: formData.is_featured,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success("Learning resource created successfully!");
      setFormData({
        title: "",
        description: "",
        content: "",
        resource_type: "article",
        category: "general",
        thumbnail_url: "",
        resource_url: "",
        duration_minutes: "",
        difficulty_level: "beginner",
        is_featured: false,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating resource:', error);
      toast.error(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Add Learning Resource
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter resource title"
              required
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Resource Type</Label>
              <div className="grid grid-cols-5 gap-1 mt-2">
                {resourceTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.resource_type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, resource_type: type.value })}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 mt-2 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resource_url">Resource URL</Label>
              <Input
                id="resource_url"
                type="url"
                value={formData.resource_url}
                onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Duration & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <select
                id="difficulty"
                value={formData.difficulty_level}
                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                className="w-full h-10 mt-0 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Full Content (optional)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content or notes..."
              rows={5}
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <Label htmlFor="featured" className="text-sm font-medium">Feature this resource</Label>
              <p className="text-xs text-slate-500">Featured resources appear at the top of the Learning Hub</p>
            </div>
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}