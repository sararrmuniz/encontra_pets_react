export function normalizeBrazilianPhone(value: string): string {
  let digits = value.replace(/\D/g, '');

  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
}

export function formatBrazilianPhone(value: string): string {
  const digits = normalizeBrazilianPhone(value);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);
  const isMobile = number.startsWith('9') || digits.length > 10;
  const prefixLength = isMobile ? 5 : 4;

  if (number.length <= prefixLength) return `(${areaCode}) ${number}`;

  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`;
}
