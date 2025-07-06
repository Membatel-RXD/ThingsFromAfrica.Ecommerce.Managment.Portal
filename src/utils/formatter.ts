export function formatCurrency(value: number | string, currency: string = 'MWK', locale: string = 'en-MW'): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
  
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num);
  }