import { z } from "zod";

export const insertConfirmationSchema = z.object({
  eventId: z.uuid(),

  name: z
    .string()
    .trim()
    .min(3, {
      message: "Nome obrigatório.",
    })
    .max(50),

  phone: z.string().trim().min(10).max(15),

  adultsCount: z.number().min(0).max(20),

  childrenCount: z.number().min(0).max(20),

  note: z.string().max(200).optional(),
});

export type InsertConfirmationSchema = z.infer<typeof insertConfirmationSchema>;
