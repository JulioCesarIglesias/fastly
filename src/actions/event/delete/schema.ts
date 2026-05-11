import { z } from "zod";

export const deleteEventSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteEventSchema = z.infer<typeof deleteEventSchema>;
