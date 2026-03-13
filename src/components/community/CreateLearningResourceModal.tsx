import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, BookOpen, Upload, Link as LinkIcon, Image, Video, Mail, X, Users, UserMinus, UserCheck } from "lucide-react";

const LEARNING_TOPICS = [
  { value: "investment_thesis", label: "Investment thesis" },
  { value: "fund_economics", label: "Fund economics" },
  { value: "capital_raising", label: "Capital raising" },
  { value: "team", label: "Team" },
  { value: "track_record", label: "Track record" },
  { value: "investment_process", label: "Investment process" },
  { value: "operations", label: "Operations" },
  { value: "esg_impact", label: "ESG & Impact" },
  { value: "sme_support", label: "SME support" },
  { value: "other", label: "Other" },
] as const;

interface CreateLearningResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateLearningResourceModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateLearningResourceModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    topic: "investment_thesis" as (typeof LEARNING_TOPICS)[number]["value"],
    topic_other: "",
    media_type: "link" as "link" | "image" | "video",
    resource_url: "",
    video_thumbnail_url: "",
    caption: "",
    is_featured: false,
  });

  // Notification state
  const [sendNotification, setSendNotification] = useState(false);
  const [notifyMode, setNotifyMode] = useState<'all_members' | 'specific' | 'all_except'>('all_members');
  const [emailInput, setEmailInput] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [sendingNotification, setSendingNotification] = useState(false);

  // Fetch member emails for autocomplete
  const [memberEmails, setMemberEmails] = useState<{ email: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (open && sendNotification) {
      fetchMemberEmails();
    }
  }, [open, sendNotification]);

  const fetchMemberEmails = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('email, full_name, user_role')
      .in('user_role', ['member', 'admin'])
      .order('full_name');
    if (data) {
      setMemberEmails(data.map(d => ({ email: d.email, name: d.full_name || d.email })));
    }
  };

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && !selectedEmails.includes(trimmed)) {
      setSelectedEmails(prev => [...prev, trimmed]);
    }
    setEmailInput("");
    setShowSuggestions(false);
  };

  const removeEmail = (email: string) => {
    setSelectedEmails(prev => prev.filter(e => e !== email));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (emailInput.trim()) addEmail(emailInput);
    }
  };

  const filteredSuggestions = memberEmails.filter(
    m => (m.email.toLowerCase().includes(emailInput.toLowerCase()) || m.name.toLowerCase().includes(emailInput.toLowerCase())) && !selectedEmails.includes(m.email.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }
    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      media_type: isImage ? "image" : "video",
    }));
  };

  const uploadFile = async (file: File, prefix = "main"): Promise<string | null> => {
    if (!user) return null;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}/${prefix}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("learning-media")
        .upload(fileName, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("learning-media").getPublicUrl(fileName);
      return publicUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.topic === "other" && !formData.topic_other.trim()) {
      toast.error("Please describe the topic when choosing Other");
      return;
    }
    if (formData.media_type === "link" && !formData.resource_url.trim()) {
      toast.error("Please enter a link URL");
      return;
    }
    if (
      (formData.media_type === "image" || formData.media_type === "video") &&
      !useUrl &&
      !selectedFile
    ) {
      toast.error("Please upload a file or paste a URL");
      return;
    }
    if (
      (formData.media_type === "image" || formData.media_type === "video") &&
      useUrl &&
      !formData.resource_url.trim()
    ) {
      toast.error("Please enter the media URL");
      return;
    }

    setLoading(true);
    try {
      let resourceUrl = formData.resource_url.trim();
      let thumbnailUrl: string | null =
        formData.media_type === "image" ? resourceUrl || null : null;

      if (formData.media_type !== "link" && selectedFile) {
        const uploaded = await uploadFile(selectedFile, "main");
        if (!uploaded) {
          setLoading(false);
          return;
        }
        resourceUrl = uploaded;
        if (formData.media_type === "image") thumbnailUrl = uploaded;
      }

      if (formData.media_type === "video") {
        if (thumbnailFile) {
          const thumb = await uploadFile(thumbnailFile, "thumb");
          if (thumb) thumbnailUrl = thumb;
        } else if (formData.video_thumbnail_url.trim()) {
          thumbnailUrl = formData.video_thumbnail_url.trim();
        }
      }

      const topicToCategory: Record<string, string> = {
        investment_thesis: "investment",
        fund_economics: "investment",
        capital_raising: "fundraising",
        team: "networking",
        track_record: "investment",
        investment_process: "investment",
        operations: "operations",
        esg_impact: "impact",
        sme_support: "general",
        other: "general",
      };
      const payload = {
        title: formData.title,
        description: formData.description.trim() || null,
        content: formData.content.trim() || null,
        topic: formData.topic,
        topic_other: formData.topic === "other" ? formData.topic_other.trim() : null,
        media_type: formData.media_type,
        resource_url: resourceUrl || null,
        thumbnail_url: thumbnailUrl,
        category: topicToCategory[formData.topic] ?? "general",
        resource_type: formData.media_type === "video" ? "video" : "article",
        is_featured: formData.is_featured,
        is_published: true,
        created_by: user.id,
      };

      const { error } = await supabase.from("learning_resources").insert(payload);
      if (error) throw error;

      toast.success("Learning resource created");

      // Send notification if enabled
      if (sendNotification) {
        setSendingNotification(true);
        toast.info("Sending email notifications...");
        try {
          const { data: notifData, error: notifError } = await supabase.functions.invoke('notify-resource-posted', {
            body: {
              resourceTitle: formData.title,
              resourceDescription: formData.description.trim() || null,
              resourceUrl: resourceUrl || null,
              thumbnailUrl,
              topic: formData.topic === "other" ? formData.topic_other : formData.topic,
              mediaType: formData.media_type,
              notifyMode,
              specificEmails: selectedEmails,
            }
          });
          if (notifError || notifData?.error) {
            toast.error(`Notification failed: ${notifData?.error || notifError?.message}`);
          } else {
            toast.success(`📧 Sent to ${notifData.sentCount} of ${notifData.totalRecipients} recipients`);
          }
        } catch (err) {
          console.error('Notification error:', err);
          toast.error('Failed to send notifications');
        } finally {
          setSendingNotification(false);
        }
      }

      setFormData({
        title: "",
        description: "",
        content: "",
        topic: "investment_thesis",
        topic_other: "",
        media_type: "link",
        resource_url: "",
        video_thumbnail_url: "",
        caption: "",
        is_featured: false,
      });
      setSelectedFile(null);
      setThumbnailFile(null);
      setSendNotification(false);
      setSelectedEmails([]);
      setNotifyMode('all_members');
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create resource";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Add Learning Resource
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 min-w-0">
          <div className="min-w-0">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter resource title"
              required
              className="break-words"
            />
          </div>

          <div className="min-w-0">
            <Label htmlFor="topic">Topic</Label>
            <select
              id="topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  topic: e.target.value as (typeof LEARNING_TOPICS)[number]["value"],
                })
              }
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
            >
              {LEARNING_TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {formData.topic === "other" && (
              <div className="mt-3 min-w-0">
                <Label htmlFor="topic_other">Describe the topic</Label>
                <Input
                  id="topic_other"
                  value={formData.topic_other}
                  onChange={(e) =>
                    setFormData({ ...formData, topic_other: e.target.value })
                  }
                  placeholder="e.g. Portfolio construction"
                  className="mt-1 break-words"
                />
              </div>
            )}
          </div>

          {/* Media: Link vs Upload */}
          <div className="min-w-0">
            <Label>Media</Label>
            <RadioGroup
              value={formData.media_type}
              onValueChange={(v: "link" | "image" | "video") =>
                setFormData({ ...formData, media_type: v })
              }
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link" className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" /> Link
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center gap-1">
                  <Image className="h-4 w-4" /> Image
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-1">
                  <Video className="h-4 w-4" /> Video
                </Label>
              </div>
            </RadioGroup>

            {(formData.media_type === "link" || formData.media_type === "image" || formData.media_type === "video") && (
              <>
                {formData.media_type !== "link" && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      type="button"
                      variant={useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseUrl(true)}
                      className="flex-1"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Paste URL
                    </Button>
                    <Button
                      type="button"
                      variant={!useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseUrl(false)}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload file
                    </Button>
                  </div>
                )}
                {formData.media_type === "link" || useUrl ? (
                  <div className="mt-3 min-w-0">
                    <Label htmlFor="resource_url">
                      {formData.media_type === "link"
                        ? "Link URL"
                        : `${formData.media_type === "image" ? "Image" : "Video"} URL`}
                    </Label>
                    <Input
                      id="resource_url"
                      type="url"
                      value={formData.resource_url}
                      onChange={(e) =>
                        setFormData({ ...formData, resource_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="mt-1 break-all min-w-0"
                    />
                  </div>
                ) : (
                  <div className="mt-3 min-w-0">
                    <Label>Upload {formData.media_type}</Label>
                    <Input
                      type="file"
                      accept={
                        formData.media_type === "image"
                          ? "image/*"
                          : "video/*"
                      }
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="mt-1"
                    />
                    {selectedFile && (
                      <p className="text-sm text-slate-500 mt-1 break-all">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}
                {formData.media_type === "video" && (
                  <div className="mt-4 p-3 rounded-lg border border-slate-200 bg-slate-50/50 min-w-0">
                    <Label className="text-slate-600">Video thumbnail (optional)</Label>
                    <p className="text-xs text-slate-500 mt-0.5 mb-2 break-words">
                      Shown on cards and as preview before play. Paste URL or upload an image.
                    </p>
                    <div className="flex gap-2 flex-wrap min-w-0">
                      <Input
                        type="url"
                        value={formData.video_thumbnail_url}
                        onChange={(e) =>
                          setFormData({ ...formData, video_thumbnail_url: e.target.value })
                        }
                        placeholder="Thumbnail image URL"
                        className="flex-1 min-w-0 break-all"
                      />
                      <label className="shrink-0 inline-flex items-center justify-center rounded-md border border-input bg-background h-9 px-3 text-sm font-medium cursor-pointer hover:bg-slate-50">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setThumbnailFile(f);
                              setFormData((p) => ({ ...p, video_thumbnail_url: "" }));
                            }
                          }}
                        />
                        <Image className="h-4 w-4 mr-1" />
                        Upload
                      </label>
                    </div>
                    {thumbnailFile && (
                      <p className="text-xs text-slate-500 mt-1">
                        Thumbnail: {thumbnailFile.name}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description"
              rows={3}
              className="resize-none break-words min-w-0"
            />
          </div>

          <div className="min-w-0">
            <Label htmlFor="content">Full content (optional)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Article body or notes..."
              rows={4}
              className="resize-none break-words min-w-0"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <Label className="text-sm font-medium">Feature this resource</Label>
              <p className="text-xs text-slate-500">
                Featured items show at the top of the Learning Lab
              </p>
            </div>
            <Switch
              checked={formData.is_featured}
              onCheckedChange={(c) =>
                setFormData({ ...formData, is_featured: c })
              }
            />
          </div>

          {/* Email Notification Section */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-700" />
                <div>
                  <Label className="text-sm font-medium text-amber-900">Email notification</Label>
                  <p className="text-xs text-amber-700">
                    AI-polished email sent to selected members
                  </p>
                </div>
              </div>
              <Switch
                checked={sendNotification}
                onCheckedChange={setSendNotification}
              />
            </div>

            {sendNotification && (
              <div className="space-y-3 pt-2 border-t border-amber-200">
                {/* Notify Mode */}
                <div>
                  <Label className="text-xs text-amber-800 font-medium">Send to</Label>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant={notifyMode === 'all_members' ? 'default' : 'outline'}
                      className={notifyMode === 'all_members' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-amber-300 text-amber-800'}
                      onClick={() => { setNotifyMode('all_members'); setSelectedEmails([]); }}
                    >
                      <Users className="h-3.5 w-3.5 mr-1" />
                      All members
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={notifyMode === 'specific' ? 'default' : 'outline'}
                      className={notifyMode === 'specific' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-amber-300 text-amber-800'}
                      onClick={() => setNotifyMode('specific')}
                    >
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      Specific emails
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={notifyMode === 'all_except' ? 'default' : 'outline'}
                      className={notifyMode === 'all_except' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-amber-300 text-amber-800'}
                      onClick={() => setNotifyMode('all_except')}
                    >
                      <UserMinus className="h-3.5 w-3.5 mr-1" />
                      All except
                    </Button>
                  </div>
                </div>

                {/* Email input for specific/exclude modes */}
                {(notifyMode === 'specific' || notifyMode === 'all_except') && (
                  <div className="relative">
                    <Label className="text-xs text-amber-800">
                      {notifyMode === 'specific' ? 'Emails to send to' : 'Emails to exclude'}
                    </Label>
                    <div className="mt-1">
                      {selectedEmails.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {selectedEmails.map(email => (
                            <Badge key={email} variant="secondary" className="bg-amber-100 text-amber-800 text-xs pr-1">
                              {email}
                              <button type="button" onClick={() => removeEmail(email)} className="ml-1 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Input
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setShowSuggestions(true); }}
                        onKeyDown={handleEmailKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Type email or name to search..."
                        className="bg-white border-amber-300"
                      />
                      {showSuggestions && emailInput.length > 0 && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-amber-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {filteredSuggestions.slice(0, 8).map(m => (
                            <button
                              key={m.email}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-amber-50 text-sm flex justify-between items-center"
                              onMouseDown={(e) => { e.preventDefault(); addEmail(m.email); }}
                            >
                              <span className="font-medium text-slate-800">{m.name}</span>
                              <span className="text-xs text-slate-500">{m.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-600 mt-1">Press Enter or comma to add. Type to search members.</p>
                  </div>
                )}

                {notifyMode === 'all_members' && (
                  <p className="text-xs text-amber-700 bg-amber-100 rounded-md px-3 py-2">
                    📧 Will be sent to all members and admins (primary + team members). Viewers are excluded.
                  </p>
                )}
              </div>
            )}
          </div>

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
              disabled={loading || uploading || sendingNotification}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {(loading || uploading || sendingNotification) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {sendingNotification ? "Sending emails…" : uploading ? "Uploading…" : sendNotification ? "Publish & notify" : "Publish resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
