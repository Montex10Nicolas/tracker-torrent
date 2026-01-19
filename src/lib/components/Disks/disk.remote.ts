import { form } from "$app/server";
import { db } from "$lib/server/db";
import { disk } from "$lib/server/db/schema";
import * as v from "valibot";

export const createDisk = form(v.object({
  name: v.pipe(v.string(), v.minLength(3)),
  space: v.pipe(v.number(), v.minValue(1))
}), async ({ name, space }) => {
  await db.insert(disk).values({
    id: crypto.randomUUID(),
    name,
    space
  })
});
