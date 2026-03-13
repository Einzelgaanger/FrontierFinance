import { supabase } from "@/integrations/supabase/client";
import type { Attachment } from "./AttachmentManager";

/**
 * Uploads files and saves attachment records after a blog/resource is created.
 */
export async function saveAttachments(
  attachments: Attachment[],
  opts: { blogId?: string; resourceId?: string; userId: string; bucket: string }
): Promise<number> {
  let savedCount = 0;

  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    let url = att.url;

    // Upload file if present
    if (att.file) {
      const ext = att.file.name.split(".").pop();
      const fileName = `${opts.userId}/att-${Date.now()}-${i}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(opts.bucket)
        .upload(fileName, att.file);
      if (uploadError) {
        console.error("Attachment upload error:", uploadError);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from(opts.bucket).getPublicUrl(fileName);
      url = publicUrl;
    }

    if (!url || url.startsWith("blob:")) continue;

    const { error } = await supabase.from("post_attachments").insert({
      blog_id: opts.blogId || null,
      resource_id: opts.resourceId || null,
      attachment_type: att.type,
      url,
      caption: att.caption || null,
      sort_order: i,
      created_by: opts.userId,
    });

    if (!error) savedCount++;
  }

  return savedCount;
}
