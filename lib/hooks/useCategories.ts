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

  const createCategory = useCallback(async (categoryData: { name: string; icon: string; color: string }) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error: createError } = await supabase
        .from('categories')
        .insert({
          ...categoryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating category:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create category' };
    }
  }, [user, supabase, fetchCategories]);

  const updateCategory = useCallback(async (id: string, categoryData: { name: string; icon: string; color: string }) => {
    if (!user) throw new Error('User must be logged in');

    try {
      // Check if category belongs to user
      const { data: existingCategory, error: fetchError } = await supabase
        .from('categories')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!existingCategory) throw new Error('Category not found');
      if (existingCategory.user_id !== user.id) {
        throw new Error('You can only edit your own categories');
      }

      const { data, error: updateError } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update category' };
    }
  }, [user, supabase, fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      // Check if category belongs to user
      const { data: existingCategory, error: fetchError } = await supabase
        .from('categories')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!existingCategory) throw new Error('Category not found');
      if (existingCategory.user_id !== user.id) {
        throw new Error('You can only delete your own categories');
      }

      // Check if category is in use
      const { data: expensesUsingCategory, error: checkError } = await supabase
        .from('expenses')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (checkError) throw checkError;
      if (expensesUsingCategory && expensesUsingCategory.length > 0) {
        throw new Error('Cannot delete category that is being used by expenses');
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchCategories();
      await fetchSubcategories();
      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete category' };
    }
  }, [user, supabase, fetchCategories, fetchSubcategories]);

  const createSubcategory = useCallback(async (subcategoryData: { category_id: string; name: string; icon: string; color: string }) => {
    try {
      const { data, error: createError } = await supabase
        .from('subcategories')
        .insert(subcategoryData)
        .select()
        .single();

      if (createError) throw createError;

      await fetchSubcategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating subcategory:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create subcategory' };
    }
  }, [supabase, fetchSubcategories]);

  const updateSubcategory = useCallback(async (id: string, subcategoryData: { name: string; icon: string; color: string }) => {
    try {
      const { data, error: updateError } = await supabase
        .from('subcategories')
        .update(subcategoryData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchSubcategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating subcategory:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update subcategory' };
    }
  }, [supabase, fetchSubcategories]);

  const deleteSubcategory = useCallback(async (id: string) => {
    try {
      // Check if subcategory is in use
      const { data: expensesUsingSubcategory, error: checkError } = await supabase
        .from('expenses')
        .select('id')
        .eq('subcategory_id', id)
        .limit(1);

      if (checkError) throw checkError;
      if (expensesUsingSubcategory && expensesUsingSubcategory.length > 0) {
        throw new Error('Cannot delete subcategory that is being used by expenses');
      }

      const { error: deleteError } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchSubcategories();
      return { error: null };
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete subcategory' };
    }
  }, [supabase, fetchSubcategories]);

  return {
    categories,
    subcategories,
    loading,
    error,
    refetch: fetchCategories,
    getSubcategoriesByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
}

