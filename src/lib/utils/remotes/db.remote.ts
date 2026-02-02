import { query } from "$app/server";
import { db } from "$lib/server/db";
import { disk, tracker, type TrackerSelect } from "$lib/server/db/schema"
import { asc } from "drizzle-orm";

export const getAllTrackers = query(async () => {
  const trackers = await db.select().from(tracker).orderBy(asc(tracker.name));
  const goodOne: TrackerSelect[] = [];
  const nullable = trackers.filter((tracker) => {
    if (tracker.name === "NULL") return tracker;
    else goodOne.push(tracker);
  });
  goodOne.sort((first, second) => {
    return Number(first.name) - Number(second.name);
  })
  return [...goodOne, nullable[0]];
});

export const getAllDisks = query(async () => {
  return await db.select().from(disk);
})

