import { form } from "$app/server";
import { db } from "$lib/server/db";
import { tracker } from "$lib/server/db/schema";
import * as v from "valibot";

export const createTracker = form(v.object({
  name: v.pipe(v.string(), v.minLength(3))
}), async ({ name }) => {
  await db.insert(tracker).values({
    id: crypto.randomUUID(),
    name
  });
});
