export function formatDate(date: Date | null | undefined | string): string {
  if (!date || isNaN(new Date(date).getTime())) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getTimeAgo(date: Date | null | undefined | string): string {
  if (!date || isNaN(new Date(date).getTime())) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) {
    // Future date
    const futureDiff = Math.abs(diff);
    const futureMinutes = Math.round(futureDiff / 60000);
    const futureHours = Math.round(futureMinutes / 60);
    const futureDays = Math.round(futureHours / 24);

    if (futureDays > 0) return `in ${futureDays} day${futureDays === 1 ? '' : 's'}`;
    if (futureHours > 0) return `in ${futureHours} hour${futureHours === 1 ? '' : 's'}`;
    if (futureMinutes > 0) return `in ${futureMinutes} minute${futureMinutes === 1 ? '' : 's'}`;
    return 'just now';
  }

  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'just now';
}

export function getDurationString(minutes: number): string {
  if (minutes <= 0) return '0 mins';
  
  const days = Math.floor(minutes / 1440);
  const remainingMinutes = minutes % 1440;
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (mins > 0) parts.push(`${mins} mins`);

  return parts.join(' ');
}
