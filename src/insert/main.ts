import { createKeyValuePair } from "../utils/utils.ts";
// import { generate } from "./generateStrings.ts";

const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH"));

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

// generate().then((data) => {
//   const array = JSON.parse(data.text ?? "[]") as string[];

//   for (let i = 0; i < array.length; i++) {
//     const { key, value } = createKeyValuePair(array[i]);

//     kv.set(key, value);
//   }
// });
