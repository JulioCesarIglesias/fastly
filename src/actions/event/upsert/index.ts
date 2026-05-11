"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertEventSchema } from "./schema";

export const upsertEvent = actionClient
  .schema(upsertEventSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // PRAZO DE CONFIRMAÇÃO
    // Ajusta para finalizar às 23:59:59 do dia selecionado
    const confirmationDeadline = parsedInput.confirmationDeadline
      ? new Date(parsedInput.confirmationDeadline)
      : null;

    if (confirmationDeadline) {
      confirmationDeadline.setHours(23, 59, 59, 999);
    }

    await db
      .insert(eventsTable)
      .values({
        id: parsedInput.id,
        userId: session.user.id,

        title: parsedInput.title,
        description: parsedInput.description,

        date: new Date(parsedInput.date),

        time: parsedInput.time,

        location: parsedInput.location,

        // confirmationDeadline: new Date(parsedInput.confirmationDeadline),
        confirmationDeadline,

        imageUrl: parsedInput.imageUrl,

        maxAdults: parsedInput.maxAdults,

        allowChildren: parsedInput.allowChildren,

        maxChildren: parsedInput.maxChildren,

        isActive: parsedInput.isActive,
      })
      .onConflictDoUpdate({
        target: [eventsTable.id],
        set: {
          title: parsedInput.title,
          description: parsedInput.description,

          date: new Date(parsedInput.date),

          time: parsedInput.time,

          location: parsedInput.location,

          confirmationDeadline: new Date(parsedInput.confirmationDeadline),

          imageUrl: parsedInput.imageUrl,

          maxAdults: parsedInput.maxAdults,

          allowChildren: parsedInput.allowChildren,

          maxChildren: parsedInput.maxChildren,

          isActive: parsedInput.isActive,

          updatedAt: new Date(),
        },
      });

    revalidatePath("/events");
  });
