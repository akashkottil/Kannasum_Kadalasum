'use client';

import { useState } from 'react';
import { Category, CategoryFormData } from '@/lib/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const COMMON_ICONS = ['🏠', '🍽️', '🚗', '📱', '🛍️', '🏥', '🎬', '✈️', '💳', '🎁', '📈', '📚', '👶', '📦', '💰', '🍔', '☕', '🎮', '🎵', '💊', '👔', '📺', '🌐', '⚡', '🔧', '🎓', '💻', '🎯'];

const COMMON_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8D8EA', '#FF9F9F', '#C7CEEA', '#FFA07A',
  '#FF6B9D', '#FFD93D', '#6BCF7F', '#3498DB', '#E67E22', '#95A5A6', '#9B59B6', '#FF5733',
  '#33C3F0', '#FFC300', '#C70039', '#900C3F', '#581845', '#1A237E', '#4A148C'
];

export function CategoryForm({ category, onSubmit, onCancel, loading }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    icon: category?.icon || '📦',
    color: category?.color || '#95A5A6',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Housing & Home"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <div className="flex gap-2">
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📦"
                maxLength={2}
                className="w-20"
                disabled={loading}
              />
              <div className="flex-1 flex flex-wrap gap-2">
                {COMMON_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-md border-2 flex items-center justify-center text-lg ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    disabled={loading}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10"
                disabled={loading}
              />
              <div className="flex-1 flex flex-wrap gap-2">
                {COMMON_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-md border-2 ${
                      formData.color === color
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

