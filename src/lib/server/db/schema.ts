import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boolean } from "drizzle-orm/mysql-core";
import { timestampSql } from ".";

export const disk = sqliteTable("disk", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  space: integer("space").notNull(),
});

export const record = sqliteTable("item", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  upTimeNeeded: integer("upTimeNeeded").notNull(),
  upTime: integer("uptime").notNull(),
  watched: boolean("watched").notNull(),
  deleted: boolean("deleted").notNull(),
  disk: integer("disk").notNull(),
  completedAt: timestampSql("completedAt", "timestamp_ms").notNull(),
  updatedAt: timestampSql("updatedAt", "timestamp").notNull(),
});
