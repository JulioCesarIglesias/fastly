import { z } from "zod";

export const upsertEventSchema = z.object({
  id: z.string().uuid().optional(),

  title: z.string().trim().min(1, {
    message: "Título é obrigatório.",
  }),

  description: z.string().trim().optional(),

  // date: z.string().min(1, {
  //   message: "Data é obrigatória.",
  // }),
  date: z.date({
    message: "Data é obrigatória.",
  }),

  time: z.string().trim().min(1, {
    message: "Hora é obrigatória.",
  }),

  location: z.string().trim().min(1, {
    message: "Local é obrigatório.",
  }),

  // confirmationDeadline: z.string().min(1, {
  //   message: "Prazo de confirmação é obrigatório.",
  // }),
  confirmationDeadline: z.date({
    message: "Prazo de confirmação é obrigatório.",
  }),

  imageUrl: z.string().trim().optional(),

  maxAdults: z.number().min(0, {
    message: "Número máximo de adultos é obrigatório.",
  }),

  allowChildren: z.boolean(),

  maxChildren: z.number().min(0, {
    message: "Número máximo de crianças é obrigatório.",
  }),

  isActive: z.boolean(),
});

export type UpsertEventSchema = z.infer<typeof upsertEventSchema>;
