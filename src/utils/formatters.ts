// Bangladeshi Financial Formatter Module
// Follows Indian numbering system (Lakh/Crore grouping).
// Summary mode allows L and Cr only; NO 'K' or 'M'.
// Exact mode displays exact taka, e.g. ৳8,95,200. Negative values format with '−৳'.
// Supports optional Bangla numeral and label conversion.

const banglaDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const toBanglaNumeral = (text: string | number): string => {
  return String(text).replace(/[0-9]/g, (digit) => banglaDigits[digit] ?? digit);
};

export interface FormatBDTOptions {
  mode?: 'exact' | 'summary';
  bangla?: boolean;
}

export const formatBDT = (
  amount: number | null | undefined,
  options: FormatBDTOptions = {}
): string => {
  if (amount == null || isNaN(amount)) return '৳০';
  const { mode = 'exact', bangla = false } = options;
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  let formattedNumber = '';

  if (mode === 'summary') {
    if (absVal >= 10000000) {
      // Crore (1 Cr = 1,00,00,000)
      const crVal = (absVal / 10000000).toFixed(2);
      formattedNumber = bangla ? `${toBanglaNumeral(crVal)} কোটি` : `${crVal} Cr`;
    } else if (absVal >= 100000) {
      // Lakh (1 L = 1,00,000)
      const lVal = (absVal / 100000).toFixed(1);
      formattedNumber = bangla ? `${toBanglaNumeral(lVal)} লাখ` : `${lVal} L`;
    } else {
      const enFormatted = absVal.toLocaleString('en-IN');
      formattedNumber = bangla ? toBanglaNumeral(enFormatted) : enFormatted;
    }
  } else {
    // Exact mode (Indian grouping, exact taka)
    const enFormatted = Math.round(absVal).toLocaleString('en-IN');
    formattedNumber = bangla ? toBanglaNumeral(enFormatted) : enFormatted;
  }

  const sign = isNegative ? '−' : '';
  const currencySign = bangla ? '৳' : '৳';
  return `${sign}${currencySign}${formattedNumber}`;
};

export const formatCompactBDT = (amount: number | null | undefined, bangla = false): string => {
  return formatBDT(amount, { mode: 'summary', bangla });
};

export const formatTakaNumber = (amount: number | null | undefined, bangla = false): string => {
  if (amount == null || isNaN(amount)) return '0';
  const isNegative = amount < 0;
  const abs = Math.round(Math.abs(amount)).toLocaleString('en-IN');
  const formatted = bangla ? toBanglaNumeral(abs) : abs;
  return isNegative ? `−${formatted}` : formatted;
};

export const formatVariance = (amount: number, bangla = false): string => {
  if (amount === 0) return bangla ? '৳০' : '৳0';
  const isNegative = amount < 0;
  const prefix = isNegative ? '−৳' : '+৳';
  const absFormatted = Math.abs(amount).toLocaleString('en-IN');
  return `${prefix}${bangla ? toBanglaNumeral(absFormatted) : absFormatted}`;
};

export const formatPercent = (value: number, decimals = 1, bangla = false): string => {
  const formatted = value.toFixed(decimals);
  return `${bangla ? toBanglaNumeral(formatted) : formatted}%`;
};

// Bangla Terminology Dictionary (D6)
export const banglaTerms: Record<string, string> = {
  'War Room': 'ওয়ার রুম',
  'Liquid Cash': 'তারল্য নগদ',
  'Bank Cash': 'ব্যাংক স্থিতি',
  'Vault / Till Cash': 'ভল্ট / ক্যাশ বাক্স',
  'Principal Auto-Debit': 'কোম্পানি অটো-ডেবিট',
  'Due in': 'বাকি সময়',
  'Hours': 'ঘণ্টা',
  'Dispatch Status': 'ডেসপ্যাচ অবস্থা',
  'On Time': 'অন টাইম',
  'Late': 'বিলম্বিত',
  'Dispatch Failed': 'ব্যর্থ ডেসপ্যাচ',
  'Cash Variance': 'ক্যাশ ব্যবধান',
  'Credit Share': 'বাকি অনুপাত',
  'Overdue > 30 Days': '৩০ দিনের বেশি মেয়াদোত্তীর্ণ',
  'Active Exception': 'সক্রিয় ব্যতিক্রম',
  'SAFE': 'নিরাপদ',
  'WATCH': 'সতর্কতা',
  'CRITICAL': 'ঝুঁকিপূর্ণ',
  'ACTION': 'জরুরি পদক্ষেপ',
  'REVIEW': 'পর্যালোচনা',
  'OK': 'স্বাভাবিক',
  'SR': 'এসআর (অর্ডার সংগ্রহকারী)',
  'JSR': 'জেএসআর (ডেলিভারি ম্যান)',
  'Pause Credit': 'ক্রেডিট সাময়িক স্থগিত',
  'Prepare Bank Deposit': 'ব্যাংক জমা প্রস্তুত',
  'Review and Close Day': 'দিন সমাপ্তি যাচাই',
  'Open Shortage Case': 'ঘাটতি মামলা নথিভুক্তি',
};
