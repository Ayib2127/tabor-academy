import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return format(dateObj, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function getTimeAgo(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return '';
  }
}

export function getDurationString(minutes: number): string {
  if (minutes <= 0) return '0 mins';
  
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  
  let result = '';
  
  if (days > 0) {
    result += `${days} day${days !== 1 ? 's' : ''}`;
    if (hours > 0) result += ` ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    if (mins > 0) result += ` ${mins} min${mins !== 1 ? 's' : ''}`;
  } else {
    result += `${mins} min${mins !== 1 ? 's' : ''}`;
  }
  
  return result;
}

// Progress calculation utilities
export function calculateProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  if (completed >= total) return 100;
  
  return Math.round((completed / total) * 100);
}

export function getCompletionStatus(progress: number): 'not-started' | 'in-progress' | 'completed' {
  if (progress <= 0) return 'not-started';
  if (progress >= 100) return 'completed';
  return 'in-progress';
}

// Data formatting utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en-US').format(number);
}

// URL and string utilities
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function getYouTubeEmbedUrl(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  
  return '';
}