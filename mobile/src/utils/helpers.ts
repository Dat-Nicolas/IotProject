export const formatTemp = (value: number): string => `${value.toFixed(1)}°C`;

export const formatDateTime = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};
