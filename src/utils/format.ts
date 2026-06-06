import dayjs from 'dayjs';

export const formatMoney = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)}亿元`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}万元`;
  }
  return `${amount.toLocaleString()}元`;
};

export const formatDate = (date: string, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    processing: 'processing',
    completed: 'success',
    closed: 'success',
    high: 'error',
    medium: 'warning',
    low: 'success',
    ongoing: 'processing',
    scheduled: 'default',
    AAA: 'success',
    AA: 'success',
    A: 'processing',
    B: 'default',
    C: 'warning',
    D: 'error',
  };
  return colorMap[status] || 'default';
};
