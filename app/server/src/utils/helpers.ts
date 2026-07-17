export const parseJson = (str: string): Record<string, string> | null => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};
