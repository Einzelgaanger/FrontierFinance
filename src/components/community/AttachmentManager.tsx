import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle, X, Link as LinkIcon, Image, Video, Upload, GripVertical } from "lucide-react";

export interface Attachment {
  id: string; // local temp id
  type: "link" | "image" | "video";
  url: string;
  file?: File;
  caption: string;
}

interface AttachmentManagerProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  bucket: string; // storage bucket for uploads
  maxAttachments?: number;
}

let counter = 0;
const tempId = () => `att-${Date.now()}-${counter++}`;

export function AttachmentManager({ attachments, onChange, maxAttachments = 10 }: AttachmentManagerProps) {
  const [addType, setAddType] = useState<"link" | "image" | "video">("link");

  const addAttachment = () => {
    if (attachments.length >= maxAttachments) {
      toast.error(`Maximum ${maxAttachments} attachments allowed`);
      return;
    }
    onChange([...attachments, { id: tempId(), type: addType, url: "", caption: "" }]);
  };

  const updateAttachment = (id: string, updates: Partial<Attachment>) => {
    onChange(attachments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAttachment = (id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  };

  const handleFileSelect = (id: string, file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File must be under 50MB");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updateAttachment(id, {
      file,
      url: previewUrl,
      type: isImage ? "image" : "video",
    });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-3.5 w-3.5" />;
      case "video": return <Video className="h-3.5 w-3.5" />;
      default: return <LinkIcon className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Attachments <span className="text-slate-400 font-normal">({attachments.length}/{maxAttachments})</span>
        </Label>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, idx) => (
            <div key={att.id} className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1 pt-1 text-slate-400">
                <GripVertical className="h-4 w-4" />
                <span className="text-xs font-mono w-4 text-center">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {typeIcon(att.type)}
                    {att.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* URL or file upload */}
                {att.type === "link" ? (
                  <Input
                    type="url"
                    value={att.file ? "" : att.url}
                    onChange={e => updateAttachment(att.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="text-sm h-8"
                  />
                ) : (
                  <div className="space-y-1.5">
                    {att.file ? (
                      <div className="flex items-center gap-2">
                        {att.type === "image" && att.url && (
                          <img src={att.url} alt="" className="h-10 w-10 rounded object-cover border" />
                        )}
                        <span className="text-xs text-slate-600 truncate">{att.file.name}</span>
                        <button
                          type="button"
                          onClick={() => updateAttachment(att.id, { file: undefined, url: "" })}
                          className="text-xs text-slate-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ) : att.url && !att.url.startsWith("blob:") ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="url"
                          value={att.url}
                          onChange={e => updateAttachment(att.id, { url: e.target.value })}
                          placeholder={`Paste ${att.type} URL...`}
                          className="text-sm h-8 flex-1"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          value={att.url.startsWith("blob:") ? "" : att.url}
                          onChange={e => updateAttachment(att.id, { url: e.target.value })}
                          placeholder={`Paste ${att.type} URL...`}
                          className="text-sm h-8 flex-1"
                        />
                        <label className="shrink-0 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white h-8 px-2 text-xs cursor-pointer hover:bg-slate-50">
                          <input
                            type="file"
                            accept={att.type === "image" ? "image/*" : "video/*"}
                            className="sr-only"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileSelect(att.id, f);
                            }}
                          />
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          Upload
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Caption */}
                <Input
                  value={att.caption}
                  onChange={e => updateAttachment(att.id, { caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className="text-sm h-7 text-slate-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {attachments.length < maxAttachments && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
            {(["link", "image", "video"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setAddType(t)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  addType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {typeIcon(t)}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addAttachment} className="h-7 text-xs gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Add {addType}
          </Button>
        </div>
      )}
    </div>
  );
}
