import { assertEquals } from "@std/assert";
import { createKey } from "../insert.ts";

Deno.test("createKey handles a standard string correctly", () => {
  const input = "hello";
  const expected = ["h", "he", "hel", "hell", "hello"];
  assertEquals(createKey(input), expected);
});

Deno.test("createKey returns an empty array for an empty string", () => {
  const input = "";
  const expected: string[] = [];
  assertEquals(createKey(input), expected);
});

Deno.test("createKey handles a single character string", () => {
  const input = "a";
  const expected = ["a"];
  assertEquals(createKey(input), expected);
});

Deno.test("createKey handles strings with spaces", () => {
  const input = "hello world";
  const expected = [
    "h",
    "he",
    "hel",
    "hell",
    "hello",
    "hello ",
    "hello w",
    "hello wo",
    "hello wor",
    "hello worl",
    "hello world",
  ];
  assertEquals(createKey(input), expected);
});

Deno.test("createKey handles strings with special characters", () => {
  const input = "!@#$";
  const expected = ["!", "!@", "!@#", "!@#$"];
  assertEquals(createKey(input), expected);
});

Deno.test("createKey handles numeric strings", () => {
  const input = "12345";
  const expected = ["1", "12", "123", "1234", "12345"];
  assertEquals(createKey(input), expected);
});
