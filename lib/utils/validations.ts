import { ExpenseFormData, CategoryFormData, SubcategoryFormData } from '@/lib/types';

export function validateExpense(data: ExpenseFormData): string[] {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!data.category_id) {
    errors.push('Category is required');
  }

  if (!data.date) {
    errors.push('Date is required');
  }

  if (data.date && !isValidDate(data.date)) {
    errors.push('Invalid date format');
  }

  if (data.time && !isValidTime(data.time)) {
    errors.push('Invalid time format');
  }

  return errors;
}

export function validateCategory(data: CategoryFormData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Category name is required');
  }

  if (!data.icon) {
    errors.push('Icon is required');
  }

  if (!data.color) {
    errors.push('Color is required');
  }

  if (!isValidColor(data.color)) {
    errors.push('Invalid color format');
  }

  return errors;
}

export function validateSubcategory(data: SubcategoryFormData): string[] {
  const errors: string[] = [];

  if (!data.category_id) {
    errors.push('Category is required');
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Subcategory name is required');
  }

  if (!data.icon) {
    errors.push('Icon is required');
  }

  if (!data.color) {
    errors.push('Color is required');
  }

  if (!isValidColor(data.color)) {
    errors.push('Invalid color format');
  }

  return errors;
}

function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timeRegex.test(time);
}

function isValidColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

