export const formatBDT = (amount: number): string => {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString('en-IN'); // Indian/BD numbering format (lakhs/crores formatting)
  return `${isNegative ? '-' : ''}৳${formatted}`;
};

export const formatCompactBDT = (amount: number): string => {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  if (absVal >= 10000000) {
    return `${isNegative ? '-' : ''}৳${(absVal / 10000000).toFixed(2)}Cr`;
  }
  if (absVal >= 100000) {
    return `${isNegative ? '-' : ''}৳${(absVal / 1000000).toFixed(3)}M`;
  }
  if (absVal >= 1000) {
    return `${isNegative ? '-' : ''}৳${(absVal / 1000).toFixed(1)}K`;
  }
  return `${isNegative ? '-' : ''}৳${absVal.toLocaleString()}`;
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatVariance = (amount: number): string => {
  if (amount === 0) return '৳0';
  const prefix = amount > 0 ? '+৳' : '-৳';
  return `${prefix}${Math.abs(amount).toLocaleString('en-IN')}`;
};
