"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

import { deleteEventSchema } from "./schema";

export const deleteEvent = actionClient
  .schema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    await db.delete(eventsTable).where(eq(eventsTable.id, parsedInput.id));
    revalidatePath("/events");
  });
