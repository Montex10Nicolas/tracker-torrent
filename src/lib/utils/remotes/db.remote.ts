import { query } from "$app/server";
import { db } from "$lib/server/db";
import { disk, tracker } from "$lib/server/db/schema"

export const getAllTrackers = query(async () => {
  return await db.select().from(tracker);
});

export const getAllDisks = query(async () => {
  return await db.select().from(disk);
})
