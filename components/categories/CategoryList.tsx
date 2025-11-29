'use client';

import { useState } from 'react';
import { Category, Subcategory } from '@/lib/types/category';
import { useCategories } from '@/lib/hooks/useCategories';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryForm } from './CategoryForm';
import { SubcategoryForm } from './SubcategoryForm';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { CategoryFormData, SubcategoryFormData } from '@/lib/types/category';

export function CategoryList() {
  const { categories, subcategories, loading, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory, refetch } = useCategories();
  const { user } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isDefaultCategory = (category: Category) => category.user_id === null;
  const isUserCategory = (category: Category) => category.user_id === user?.id;

  const getSubcategoriesByCategory = (categoryId: string): Subcategory[] => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    setFormLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, data);
        if (result.error) {
          setError(result.error);
          return;
        }
      } else {
        const result = await createCategory(data);
        if (result.error) {
          setError(result.error);
          return;
        }
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubcategorySubmit = async (data: SubcategoryFormData) => {
    setFormLoading(true);
    setError(null);

    try {
      if (editingSubcategory) {
        const result = await updateSubcategory(editingSubcategory.id, {
          name: data.name,
          icon: data.icon,
          color: data.color,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
      } else {
        const result = await createSubcategory(data);
        if (result.error) {
          setError(result.error);
          return;
        }
      }
      setShowSubcategoryForm(false);
      setEditingSubcategory(null);
      setSelectedCategoryForSubcategory(null);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save subcategory');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!isUserCategory(category)) {
      setError('You can only delete your own categories');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const result = await deleteCategory(category.id);
      if (result.error) {
        setError(result.error);
      } else {
        await refetch();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategory: Subcategory) => {
    if (!confirm(`Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`)) {
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const result = await deleteSubcategory(subcategory.id);
      if (result.error) {
        setError(result.error);
      } else {
        await refetch();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subcategory');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryForSubcategory(categoryId);
    setEditingSubcategory(null);
    setShowSubcategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    if (!isUserCategory(category)) {
      setError('You can only edit your own categories');
      return;
    }
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSelectedCategoryForSubcategory(subcategory.category_id);
    setShowSubcategoryForm(true);
  };

  if (showCategoryForm) {
    return (
      <CategoryForm
        category={editingCategory || undefined}
        onSubmit={handleCategorySubmit}
        onCancel={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
          setError(null);
        }}
        loading={formLoading}
      />
    );
  }

  if (showSubcategoryForm) {
    return (
      <SubcategoryForm
        subcategory={editingSubcategory || undefined}
        categories={categories}
        onSubmit={handleSubcategorySubmit}
        onCancel={() => {
          setShowSubcategoryForm(false);
          setEditingSubcategory(null);
          setSelectedCategoryForSubcategory(null);
          setError(null);
        }}
        loading={formLoading}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading categories...
      </div>
    );
  }

  const defaultCategories = categories.filter(cat => isDefaultCategory(cat));
  const userCategories = categories.filter(cat => isUserCategory(cat));

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Button onClick={() => {
          setEditingCategory(null);
          setShowCategoryForm(true);
          setError(null);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Default Categories */}
      {defaultCategories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Default Categories</h4>
          {defaultCategories.map((category) => {
            const categorySubcategories = getSubcategoriesByCategory(category.id);
            const isExpanded = expandedCategories.has(category.id);

            return (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center gap-2 flex-1 text-left hover:opacity-80"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({categorySubcategories.length} subcategories)
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSubcategory(category.id)}
                        title="Add subcategory"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 ml-8 space-y-2">
                      {categorySubcategories.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No subcategories</p>
                      ) : (
                        categorySubcategories.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex items-center gap-2">
                              <span>{subcategory.icon}</span>
                              <span>{subcategory.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSubcategory(subcategory)}
                                title="Edit subcategory"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(subcategory)}
                                title="Delete subcategory"
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* User Categories */}
      {userCategories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Categories</h4>
          {userCategories.map((category) => {
            const categorySubcategories = getSubcategoriesByCategory(category.id);
            const isExpanded = expandedCategories.has(category.id);

            return (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center gap-2 flex-1 text-left hover:opacity-80"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({categorySubcategories.length} subcategories)
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSubcategory(category.id)}
                        title="Add subcategory"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        title="Edit category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        title="Delete category"
                        disabled={formLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 ml-8 space-y-2">
                      {categorySubcategories.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No subcategories</p>
                      ) : (
                        categorySubcategories.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex items-center gap-2">
                              <span>{subcategory.icon}</span>
                              <span>{subcategory.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSubcategory(subcategory)}
                                title="Edit subcategory"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(subcategory)}
                                title="Delete subcategory"
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No categories found. Create your first category to get started.</p>
        </div>
      )}
    </div>
  );
}

