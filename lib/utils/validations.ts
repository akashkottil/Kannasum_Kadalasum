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

  // Validate split amounts for shared expenses
  if (data.is_shared) {
    const userAmount = data.amount_paid_by_user || 0;
    const partnerAmount = data.amount_paid_by_partner || 0;
    const totalSplit = userAmount + partnerAmount;
    const tolerance = 0.01; // Allow small floating point differences

    // If split amounts are provided, they must sum to total
    if ((data.amount_paid_by_user !== null && data.amount_paid_by_user !== undefined) ||
        (data.amount_paid_by_partner !== null && data.amount_paid_by_partner !== undefined)) {
      if (Math.abs(totalSplit - data.amount) > tolerance) {
        errors.push(`Split amounts (₹${totalSplit.toFixed(2)}) must equal total expense (₹${data.amount.toFixed(2)})`);
      }
      if (userAmount < 0 || partnerAmount < 0) {
        errors.push('Split amounts cannot be negative');
      }
      if (userAmount > data.amount || partnerAmount > data.amount) {
        errors.push('Split amounts cannot exceed total expense amount');
      }
    }
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

