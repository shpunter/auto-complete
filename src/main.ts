import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { createKey } from "./utils/utils.ts";
// import { faker } from "npm:@faker-js/faker";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.json({
    msg: "hello",
  });
});

app.get("/api/search/:search", async (c) => {
  const kv = await Deno.openKv();

  const { search } = c.req.param();
  const key = createKey(search);
  const list = await Array.fromAsync(kv.list({ prefix: key }, { limit: 5 }));

  kv.close();
  return c.json({
    list: list.map(({ value }) => value),
  });
});

app.get("/api/delete-all", async (c) => {
  const kv = await Deno.openKv();
  const allEntries = await Array.fromAsync(kv.list({ prefix: [] }));

  for (const el of allEntries) {
    await kv.delete(el.key);
  }

  kv.close();
  return c.json({ msg: "deleted" });
});

Deno.serve({ port: 8000 }, app.fetch);

// const kv = await Deno.openKv(
//   "https://api.deno.com/databases/eaf3aaef-2e26-4733-82b2-6075db53df34/connect",
// );
// let i = 1;
// const size = 300;

// setInterval(async () => {
//   const atomicOperation = kv.atomic();

//   for (let i = 0; i < size; i++) {
//     const noun = faker.word.noun();
//     const adjective = faker.word.adjective();
//     const { key, value } = createKeyValuePair(`${adjective} ${noun}`);

//     atomicOperation.set(key, value);
//   }

//   const result = await atomicOperation.commit();
//   console.log(i * size, result);
//   i += 1;
// }, 1000);
