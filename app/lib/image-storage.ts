/**
 * Image Storage Service
 * Downloads external images and saves them to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Download image from URL and save to Supabase Storage
 */
export async function downloadAndSaveImage(
  imageUrl: string,
  userId: string,
  fileName?: string
): Promise<string> {
  try {
    // Download image from external URL
    console.log(`[Image Storage] Downloading image from: ${imageUrl.substring(0, 50)}...`);
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    // Get image data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine content type from response or URL
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      throw new Error(`Unsupported image type: ${contentType}`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = contentType.split('/')[1] || 'jpg';
    const finalFileName = fileName || `${userId}/${timestamp}-${randomString}.${fileExt}`;

    // Upload to Supabase Storage
    console.log(`[Image Storage] Uploading to storage: ${finalFileName}`);
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('post-images')
      .upload(finalFileName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Image Storage] Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('post-images')
      .getPublicUrl(finalFileName);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    console.log(`[Image Storage] Successfully saved image: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('[Image Storage] Error:', error);
    throw new Error(`Failed to download and save image: ${error.message}`);
  }
}

/**
 * Check if URL is external (not from our Supabase Storage)
 */
export function isExternalImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check if it's already from our Supabase Storage
  const supabaseStoragePattern = new RegExp(
    `${supabaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/storage/v1/object/public/post-images/`
  );
  
  if (supabaseStoragePattern.test(url)) {
    return false; // Already in our storage
  }
  
  // Check if it's from A4F or other external sources
  return url.startsWith('http://') || url.startsWith('https://');
}

