import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { createKey } from "./utils/utils.ts";

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
    list,
  });
});

Deno.serve({ port: 8000 }, app.fetch);
