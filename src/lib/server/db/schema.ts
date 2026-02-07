import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const disk = sqliteTable("disk", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  space: integer("space").notNull(),
});

export const tracker = sqliteTable("tracker", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  latestDownload: integer("latestDownload", { mode: "timestamp" })
})

// Duration, upTime and upTimeNeeded are in minutes
// Size is in GB
export const recordDB = sqliteTable("record", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size"),
  duration: integer('duration'),
  upTimeNeeded: integer("upTimeNeeded"),
  upTime: integer("uptime"),
  isWatched: integer("watched", { mode: "boolean" }),
  isDeleted: integer("deleted", { mode: "boolean" }),
  diskID: text("diskID").references(() => disk.id),
  trackerID: text("trackerID").references(() => tracker.id),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
})

export const messageDB = sqliteTable("message", {
  id: text("id").primaryKey(),
  content: text("content"),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  createdString: text("cString")
})

export type RecordInsert = typeof recordDB.$inferInsert
export type RecordSelect = typeof recordDB.$inferSelect;

export type DiskSelect = typeof disk.$inferSelect;
export type TrackerSelect = typeof tracker.$inferSelect;
