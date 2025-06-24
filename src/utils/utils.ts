export const createKey = (str: string): string[] => {
  if (!str) return [];

  const prefixes: string[] = Array(str.length);

  prefixes[0] = str[0].toLowerCase();

  for (let i = 1; i < str.length; i++) {
    prefixes[i] = prefixes[i - 1] + str[i].toLowerCase();
  }

  return prefixes;
};

export const createKeyValuePair = (value: string) => {
  return { key: createKey(value), value: value };
};
