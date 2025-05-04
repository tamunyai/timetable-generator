export const saveToSession = (key: string, value: any) =>
  sessionStorage.setItem(key, JSON.stringify(value));

export const loadFromSession = <T>(key: string): T | null => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
