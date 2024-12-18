import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

export interface Postcard {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  location: string;
  image_url: string;
  status: 'generating' | 'complete' | 'error';
  error?: string;
  blurb?: string;
}

export const usePostcards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const { userId } = useAuth();

  const getPostcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('postcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const typedData = data as Postcard[];
      setPostcards(typedData);
      return typedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch postcards';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    getPostcards();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('postcards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'postcards'
        },
        (payload) => {
          console.log('Change received!', payload);
          // Refresh postcards
          getPostcards();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        console.log('Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [getPostcards]);

  const createPostcard = useCallback(async ({ location, image_url }: Pick<Postcard, 'location' | 'image_url'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        throw new Error('User must be authenticated to create a postcard');
      }

      const { data, error } = await supabase
        .from('postcards')
        .insert([
          {
            location,
            image_url,
            status: 'draft',
            user_id: userId
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      return data as Postcard;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create postcard';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updatePostcard = useCallback(async (id: string, updates: Partial<Omit<Postcard, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('postcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data as Postcard;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update postcard';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePostcard = useCallback(async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('postcards')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete postcard';
      setError(errorMessage);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    postcards,
    getPostcards,
    createPostcard,
    updatePostcard,
    deletePostcard
  };
};
