import { format, parse, isValid } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch {
    return date;
  }
}

export function formatDateTime(date: string, time: string | null): string {
  try {
    if (!time) {
      return formatDate(date);
    }
    const dateObj = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date());
    if (!isValid(dateObj)) return formatDate(date);
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch {
    return formatDate(date);
  }
}

export function formatShortDate(date: string): string {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return date;
    return format(dateObj, 'MMM dd');
  } catch {
    return date;
  }
}

export function formatMonth(date: string): string {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return date;
    return format(dateObj, 'MMMM yyyy');
  } catch {
    return date;
  }
}

export function formatDay(date: string): string {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return date;
    return format(dateObj, 'EEE');
  } catch {
    return date;
  }
}

export function getInitials(name: string | null): string {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

