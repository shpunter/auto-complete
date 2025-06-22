import { data } from "./insert/data.ts";
import { createKeyValuePair } from "./insert/insert.ts";

data.map(createKeyValuePair);
