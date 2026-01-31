import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { recordDB, tracker } from "$lib/server/db/schema";
import * as v from "valibot";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const getRecords = query(async () => {
  return await db.select().from(recordDB);
})

const insertRecordSchema = v.object({
  name: v.string(),
  size: v.number(),
  duration: v.pipe(v.number(), v.minValue(1)),
  upTimeNeeded: v.fallback(v.pipe(v.number(), v.minValue(1)), 5),
  upTime: v.pipe(v.number(), v.minValue(0)),
  isWatched: v.fallback(v.boolean(), false),
  isDeleted: v.fallback(v.boolean(), false),
  diskID: v.string(),
  trackerID: v.string(),
  completedAt: v.pipe(v.string(), v.isoDateTime()),
  updatedAt: v.number()
});

export const insertRecord = form(insertRecordSchema, async ({
  name, size, duration, upTime, upTimeNeeded, isWatched, isDeleted, completedAt, updatedAt, trackerID, diskID
}) => {
  try {
    await db.insert(recordDB).values({
      id: crypto.randomUUID(),
      diskID,
      completedAt: new Date(completedAt),
      name,
      size,
      duration,
      isDeleted,
      isWatched,
      trackerID,
      upTime,
      upTimeNeeded,
      updatedAt: new Date(updatedAt)
    });
    await db.update(tracker).set({
      latestDownload: new Date()
    }).where(eq(tracker.id, trackerID));
    return {
      response: "Everything okay"
    };
  } catch (e) {
    error(501, "Something went wrong" + e)
  }
})

const updateRecordSchema = v.object({
  id: v.string(),
  name: v.string(),
  size: v.nullable(v.number()),
  duration: v.nullable(v.pipe(v.number(), v.minValue(1))),
  upTimeNeeded: v.nullable(v.fallback(v.pipe(v.number(), v.minValue(1)), 5)),
  upTime: v.nullable(v.pipe(v.number(), v.minValue(0))),
  isWatched: v.nullable(v.fallback(v.boolean(), false)),
  isDeleted: v.nullable(v.fallback(v.boolean(), false)),
  diskID: v.nullable(v.string()),
  trackerID: v.nullable(v.string()),
  completedAt: v.nullable(v.pipe(v.string(), v.isoDateTime())),
  updatedAt: v.nullable(v.number())
});

export const updateRecord = command(updateRecordSchema, async ({
  id, name, size, duration, upTime, upTimeNeeded, isWatched, isDeleted, completedAt, updatedAt, trackerID, diskID
}) => {
  try {
    const res = await db.update(recordDB)
      .set({
        id,
        diskID,
        completedAt: completedAt !== null ? new Date(completedAt) : null,
        name,
        size,
        duration,
        isDeleted,
        isWatched,
        trackerID,
        upTime,
        upTimeNeeded,
        updatedAt: updatedAt !== null ? new Date(updatedAt) : null
      }).where(eq(recordDB.id, id))
    await getRecords().refresh();
    return {
      success: true
    }
  } catch (e) {
    error(501, "Something wrong" + e);
  }
})

export const deleteRecord = command(v.string(), async (id) => {
  try {
    const res = await db.delete(recordDB).where(eq(recordDB.id, id))
    await getRecords().refresh();
    return {
      result: true,
      res
    }
  } catch (e) {
    error(501, "Something wrong in delete record" + e);
  }
})
