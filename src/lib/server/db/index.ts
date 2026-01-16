import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { integer } from "drizzle-orm/sqlite-core";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = new Database(env.DATABASE_URL);

export function timestampSql(
  name: string,
  mode?: "number" | "boolean" | "timestamp" | "timestamp_ms",
) {
  return integer(
    name,
    mode
      ? {
          mode,
        }
      : { mode: "number" },
  );
}

export const db = drizzle(client, { schema });
