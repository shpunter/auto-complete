import { Hono } from "jsr:@hono/hono";
import { HTTPException } from "jsr:@hono/hono/http-exception";
import { cors } from "jsr:@hono/hono/cors";
import { createKey, createKeyValuePair } from "./utils/utils.ts";
import { generate } from "./insert/generateStrings.ts";

const app = new Hono();
const kv = await Deno.openKv();

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
  const { search } = c.req.param();
  const key = createKey(search);
  const list = await Array.fromAsync(kv.list({ prefix: key }, { limit: 10 }));

  return c.json({
    list: list.map(({ value }) => value),
  });
});

app.get("/api/generate-and-insert/:number/:type", async (c) => {
  const { number, type } = c.req.param();

  if (type !== "pair" && type !== "sentences") {
    throw new HTTPException(404, { message: "type is not supported" });
  }

  const data = await generate(+number, type);
  const array = JSON.parse(data.text ?? "[]") as string[];

  for (let i = 0; i < array.length; i++) {
    const { key, value } = createKeyValuePair(array[i]);

    kv.set(key, value);
  }

  return c.json({
    data: data.text,
  });
});

app.get("/api/loop/:number/", async (c) => {
  const { number } = c.req.param();
  let count = +number;

  while (count > 0) {
    const data = await generate(1000, "pair");
    const array = JSON.parse(data.text ?? "[]") as string[];

    for (let i = 0; i < array.length; i++) {
      const { key, value } = createKeyValuePair(array[i]);

      kv.set(key, value);
    }

    count -= 1;
  }

  return c.json("done");
});

Deno.serve({ port: 8000 }, app.fetch);
