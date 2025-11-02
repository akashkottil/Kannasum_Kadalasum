'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Category, Subcategory } from '@/lib/types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const fetchCategories = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all categories (default + user's custom categories)
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const fetchSubcategories = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('subcategories')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setSubcategories(data || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchCategories();
    fetchSubcategories();
  }, [user, fetchCategories, fetchSubcategories]);

  const getSubcategoriesByCategory = (categoryId: string): Subcategory[] => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  return {
    categories,
    subcategories,
    loading,
    error,
    refetch: fetchCategories,
    getSubcategoriesByCategory,
  };
}

