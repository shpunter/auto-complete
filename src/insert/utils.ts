import { generate } from "./createStrings.ts";

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
  return { key: createKey(value), value: value };
};

export const insert = async (array: string[]) => {
  for (let i = 0; i < array.length; i++) {
    const { key, value } = createKeyValuePair(array[i]);
    await kv.set(key, value);
  }
};

export const deleteAll = async () => {
  const allEntries = await Array.fromAsync(kv.list({ prefix: [] }));

  for await (const el of allEntries) {
    kv.delete(el.key);
  }
};

export const selectBy = async () => {
  const entries = await Array.fromAsync(kv.list({ prefix: ["t"] }));
  console.log(entries);
};

//  deleteAll();
const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH"));

generate().then((data) => {
  const array = JSON.parse(data.text ?? "[]") as string[];

  for (let i = 0; i < array.length; i++) {
    const { key, value } = createKeyValuePair(array[i]);

    kv.set(key, value);
  }
});
