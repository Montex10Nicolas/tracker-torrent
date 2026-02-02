import { query } from "$app/server";
import { db } from "$lib/server/db";
import { disk, recordDB, tracker } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";

export const recordById = query(v.string(), async (diskId) => {
  const dc = await db.select().from(disk).where(eq(disk.id, diskId)).limit(1);
  const records = await db.select().from(recordDB).where(eq(recordDB.diskID, diskId));
  const trackers = await db.select().from(tracker).orderBy(asc(tracker.name));

  return {
    disk: dc,
    records,
    trackers
  }
});
