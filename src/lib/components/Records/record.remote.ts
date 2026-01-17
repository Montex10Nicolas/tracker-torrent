import { form, query } from "$app/server";
import { db } from "$lib/server/db";
import { recordDB } from "$lib/server/db/schema";
import * as v from "valibot";
import { error } from "@sveltejs/kit";

export const getRecords = query(async () => {
  return await db.select().from(recordDB);
})

// FIXME: iso time
const insertRecordSchema = v.object({
  id: v.string(),
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
function uptimeNeeded(size: number) {
  let hours = 0;
  if (size === null || size === undefined) {
    return null;
  }
  if (size <= 1) {
    hours = 72;
  }
  if (size > 1 && size < 50) {
    hours = 72 + 2 * size;
  }
  if (size >= 50) {
    hours = 100 * Math.log(size) - 219.2023;
  }
  return hours * 60;
}
// FIXME: upTimeNeeded still does not work
export const insertRecord = form(insertRecordSchema, async ({
  id, name, size, duration, upTime, upTimeNeeded, isWatched, isDeleted, completedAt, updatedAt, trackerID, diskID
}) => {
  console.log({ id, completedAt, upTimeNeeded });
  try {
    const random = Math.random();
    // if (random < 0.5) {
    //   throw new TypeError("AH unlucky");
    // }
    await db.insert(recordDB).values({
      id,
      diskID,
      completedAt: new Date(completedAt),
      name,
      size,
      duration,
      isDeleted,
      isWatched,
      trackerID,
      upTime,
      upTimeNeeded: upTimeNeeded === 5 ? uptimeNeeded(size) : upTimeNeeded,
      updatedAt: new Date(updatedAt)
    })
    return {
      response: "Everything okay"
    };
  } catch (e: any) {
    error(501, "Something went wrong" + e)
  }

})
