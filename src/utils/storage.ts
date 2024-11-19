import { supabase } from './supabase';

export async function uploadImageToStorage(imageUrl: string, message: string): Promise<string> {
  try {
    console.log('Starting image upload process...');
    console.log('Replicate URL:', imageUrl);

    // Fetch the image from Replicate
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from Replicate: ${response.statusText}`);
    }
    const imageBlob = await response.blob();
    console.log('Successfully fetched image, size:', imageBlob.size, 'bytes');

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const sanitizedMessage = message.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);
    const filename = `postcard-${timestamp}-${sanitizedMessage}.jpg`;
    console.log('Generated filename:', filename);

    // Upload to Supabase Storage
    console.log('Starting Supabase upload...');
    const { data, error } = await supabase.storage
      .from('postcard_images')
      .upload(filename, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }
    console.log('Successfully uploaded to Supabase, path:', data.path);

    // Get the public URL
    const urlResult = supabase.storage
      .from('postcard_images')
      .getPublicUrl(data.path);
    
    console.log('URL Result:', urlResult);
    const publicUrl = urlResult.data.publicUrl;
    console.log('Final public URL:', publicUrl);

    // Verify URL is accessible
    try {
      const checkResponse = await fetch(publicUrl, { method: 'HEAD' });
      console.log('URL check status:', checkResponse.status);
      if (!checkResponse.ok) {
        console.warn('Warning: URL may not be immediately accessible');
      }
    } catch (e) {
      console.warn('URL verification failed:', e);
    }

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
}