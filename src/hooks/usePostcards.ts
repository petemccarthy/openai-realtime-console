import { useCallback, useState } from 'react';
import { supabase } from '../utils/supabase';

export interface Postcard {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  message: string;
  image_url: string;
  status: 'draft';
}

export const usePostcards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPostcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('postcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Postcard[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch postcards';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPostcard = useCallback(async ({ message, image_url }: Pick<Postcard, 'message' | 'image_url'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('postcards')
        .insert([
          {
            message,
            image_url,
            status: 'draft'
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
  }, []);

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
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('postcards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete postcard';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getPostcards,
    createPostcard,
    updatePostcard,
    deletePostcard
  };
};
