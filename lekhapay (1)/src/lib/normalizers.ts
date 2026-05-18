const banglaDigits: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export function normalizeNumber(input: string | number): number {
  if (typeof input === 'number') return input;
  
  let normalized = input.trim();
  // Replace Bangla digits with English digits
  for (const [bn, en] of Object.entries(banglaDigits)) {
    normalized = normalized.split(bn).join(en);
  }
  
  // Remove commas and other non-numeric characters except dot
  normalized = normalized.replace(/[^0-9.]/g, '');
  
  const result = parseFloat(normalized);
  return isNaN(result) ? 0 : result;
}

export function sanitizeText(text: string): string {
  return text.trim().substring(0, 500); // Limit length
}

export function normalizeDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
}
