import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const disk = sqliteTable("disk", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  space: integer("space").notNull(),
});

export const tracker = sqliteTable("tracker", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
})

export const record = sqliteTable("record", {
  id: text("id").primaryKey(),
  name: text("name"),
  size: integer("size"),
  upTimeNeeded: integer("upTimeNeeded"),
  upTime: integer("uptime"),
  isWatched: integer("watched", { mode: "boolean" }),
  isDeleted: integer("deleted", { mode: "boolean" }),
  diskID: text("diskID").references(() => disk.id),
  trackerID: text("trackerID").references(() => tracker.id),
  completedAt: integer("completedAt", { mode: "timestamp_ms" }),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
})

export type RecordInsert = typeof record.$inferInsert
export type RecordSelect = typeof record.$inferSelect;


