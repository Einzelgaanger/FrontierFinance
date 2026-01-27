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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Upload, Link as LinkIcon } from "lucide-react";

interface CreateBlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBlogModal({ open, onOpenChange, onSuccess }: CreateBlogModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    media_type: "text" as "text" | "image" | "video",
    media_url: "",
    caption: "",
    video_thumbnail_url: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setFormData({
      ...formData,
      media_type: isImage ? "image" : "video"
    });
  };

  const uploadFile = async (file?: File, prefix = ""): Promise<string | null> => {
    const toUpload = file ?? selectedFile;
    if (!toUpload || !user) return null;

    setUploading(true);
    try {
      const fileExt = toUpload.name.split('.').pop();
      const fileName = `${user.id}/${prefix ? prefix + "-" : ""}${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(fileName, toUpload);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-media')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let mediaUrl = formData.media_url;

      if (!useUrl && selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        mediaUrl = uploadedUrl;
      }

      let thumbnailUrl: string | null = null;
      if (formData.media_type === "video") {
        if (formData.video_thumbnail_url?.trim()) {
          thumbnailUrl = formData.video_thumbnail_url.trim();
        } else if (thumbnailFile) {
          const url = await uploadFile(thumbnailFile, "thumb");
          if (url) thumbnailUrl = url;
        }
      }

      const { error } = await supabase.from("blogs").insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        media_type: formData.media_type,
        media_url: mediaUrl || null,
        caption: formData.caption || null,
        thumbnail_url: thumbnailUrl,
      });

      if (error) throw error;

      toast.success("Blog post created! You earned 10 points! 🎉");
      setFormData({
        title: "",
        content: "",
        media_type: "text",
        media_url: "",
        caption: "",
        video_thumbnail_url: "",
      });
      setSelectedFile(null);
      setThumbnailFile(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Blog Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
          <div className="min-w-0">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog title"
              required
              className="break-words"
            />
          </div>

          <div className="min-w-0">
            <Label>Media Type</Label>
            <RadioGroup
              value={formData.media_type}
              onValueChange={(value: any) => setFormData({ ...formData, media_type: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video">Video</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.media_type !== "text" && (
            <div className="min-w-0 space-y-4">
              <div className="flex gap-2 mb-3 flex-wrap">
                <Button
                  type="button"
                  variant={useUrl ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseUrl(true)}
                  className="flex-1"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={!useUrl ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseUrl(false)}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>

              {useUrl ? (
                <div className="min-w-0">
                  <Label htmlFor="media_url">Media URL</Label>
                  <Input
                    id="media_url"
                    value={formData.media_url || ""}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder={`Enter ${formData.media_type} URL`}
                    type="url"
                    className="break-all min-w-0"
                  />
                </div>
              ) : (
                <div className="min-w-0">
                  <Label htmlFor="media_file">Upload {formData.media_type}</Label>
                  <Input
                    id="media_file"
                    type="file"
                    accept={formData.media_type === "image" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2 break-all">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="min-w-0">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={formData.caption || ""}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Add a caption"
                  className="break-words"
                />
              </div>

              {formData.media_type === "video" && (
                <div className="space-y-2 min-w-0">
                  <Label>Video thumbnail (optional)</Label>
                  <Input
                    value={formData.video_thumbnail_url || ""}
                    onChange={(e) => setFormData({ ...formData, video_thumbnail_url: e.target.value })}
                    placeholder="Paste thumbnail image URL"
                    type="url"
                    className="break-all min-w-0"
                  />
                  <p className="text-xs text-muted-foreground break-words">Or upload an image:</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        if (f.size > 5 * 1024 * 1024) {
                          toast.error("Thumbnail must be under 5MB");
                          return;
                        }
                        setThumbnailFile(f);
                      }
                    }}
                    disabled={uploading}
                  />
                  {thumbnailFile && (
                    <p className="text-sm text-muted-foreground break-all">Selected: {thumbnailFile.name}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="min-w-0">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts..."
              rows={6}
              className="resize-none break-words min-w-0"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? "Uploading..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
