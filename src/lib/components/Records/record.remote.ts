import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { record, type RecordInsert } from "$lib/server/db/schema";
import * as v from "valibot";

export const getRecords = query(async () => {
  return await db.select().from(record);
})

export const insertRecord = command(v.object({
  a: v.string()
}), ({
  a
}) => {

});


