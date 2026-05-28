export const dateFmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

export function formatDate(date: Date | string | undefined): string {
  if (!date) return '';
  return dateFmt.format(date instanceof Date ? date : new Date(date));
}

export function toISO(date: Date | string | undefined): string {
  if (!date) return '';
  return (date instanceof Date ? date : new Date(date)).toISOString();
}
