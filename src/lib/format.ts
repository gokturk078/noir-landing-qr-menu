export function formatCurrency({
  amount,
  language,
  currency = 'TRY',
}: {
  amount: number;
  language: string;
  currency?: string;
}) {
  const baseLanguage = (language || 'tr').split('-')[0];
  const locale = baseLanguage === 'tr' ? 'tr-TR' : baseLanguage === 'de' ? 'de-DE' : baseLanguage === 'ru' ? 'ru-RU' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    const rounded = amount % 1 === 0 ? String(amount) : amount.toFixed(2);
    return `${currency} ${rounded}`;
  }
}

