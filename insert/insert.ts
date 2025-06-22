import { data } from "./data.ts";

export const createKey = (str: string): string[] => {
  if (!str) return [];

  const prefixes: string[] = Array(str.length);

  prefixes[0] = str[0];

  for (let i = 1; i < str.length; i++) {
    prefixes[i] = prefixes[i - 1] + str[i];
  }

  return prefixes;
};

export const createKeyValuePair = (value: string) => {
  return [createKey(value), value];
};

data.map(createKeyValuePair);
