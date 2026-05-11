"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { confirmationsTable, eventsTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

import { insertConfirmationSchema } from "./schema";

export const insertConfirmation = actionClient
  .schema(insertConfirmationSchema)
  .action(async ({ parsedInput }) => {
    // Verifica se evento existe
    const event = await db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, parsedInput.eventId),
    });

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    // Evento ativo
    if (!event.isActive) {
      throw new Error("Esse evento não está mais disponível.");
    }

    // Prazo de confirmação
    const now = new Date();

    if (
      event.confirmationDeadline &&
      now > new Date(event.confirmationDeadline)
    ) {
      throw new Error("Prazo de confirmação encerrado.");
    }

    // Limite acompanhantes adultos
    if (parsedInput.adultsCount > event.maxAdults) {
      throw new Error(
        `Máximo permitido: ${event.maxAdults} acompanhantes adultos.`,
      );
    }

    // Limite acompanhantes crianças
    if (
      event.allowChildren &&
      (parsedInput.childrenCount ?? 0) > (event.maxChildren ?? 0)
    ) {
      throw new Error(
        `Máximo permitido: ${event.maxChildren ?? 0} acompanhantes crianças.`,
      );
    }

    // Evento não permite crianças
    if (!event.allowChildren && parsedInput.childrenCount) {
      throw new Error("Esse evento não permite acompanhantes crianças.");
    }

    // Normaliza telefone
    const normalizedPhone = parsedInput.phone.replace(/\D/g, "");

    // Busca confirmação existente
    const existingConfirmation = await db.query.confirmationsTable.findFirst({
      where: and(
        eq(confirmationsTable.eventId, parsedInput.eventId),
        eq(confirmationsTable.phone, normalizedPhone),
      ),
    });

    const alreadyExists = !!existingConfirmation;

    // Cria ou atualiza
    const [confirmation] = await db
      .insert(confirmationsTable)
      .values({
        eventId: parsedInput.eventId,
        name: parsedInput.name,
        phone: normalizedPhone,
        adultsCount: parsedInput.adultsCount ?? 0,
        childrenCount: parsedInput.childrenCount ?? 0,
        note: parsedInput.note,
        status: "confirmed",
      })
      .onConflictDoUpdate({
        target: [confirmationsTable.eventId, confirmationsTable.phone],
        set: {
          name: parsedInput.name,
          adultsCount: parsedInput.adultsCount ?? 0,
          childrenCount: parsedInput.childrenCount ?? 0,
          note: parsedInput.note,
          updatedAt: new Date(),
        },
      })
      .returning();

    revalidatePath(`/e/${parsedInput.eventId}`);
    revalidatePath(`/events/${parsedInput.eventId}`);

    return {
      success: true,
      alreadyExists,
      confirmation,
    };
  });
