import { query } from "$app/server";
import { db } from "$lib/server/db";
import { disk, recordDB, tracker } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";

export const getTracker = query(v.string(), async (id) => {
  const trak = (await db.select().from(tracker).where(eq(tracker.id, id)).limit(1))[0];
  const records = await db.select().from(recordDB).where(eq(recordDB.trackerID, id));

  return {
    tracker: trak,
    records
  }
});

export const recordsById = query(v.string(), async (trackerId) => {
  const trak = (await db.select().from(tracker).where(eq(tracker.id, trackerId)).limit(1))[0];

  const records = await db.select().from(recordDB).where(eq(recordDB.trackerID, trackerId));
  const disks = await db.select().from(disk).orderBy(asc(disk.name));

  return {
    trackers: trak,
    records,
    disks
  }
})
