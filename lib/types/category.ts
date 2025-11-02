export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
}

export interface SubcategoryFormData {
  category_id: string;
  name: string;
  icon: string;
  color: string;
}

