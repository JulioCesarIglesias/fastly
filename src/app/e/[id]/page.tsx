import { eq } from "drizzle-orm";
import { CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { eventsTable } from "@/db/schema";

import ConfirmationForm from "./_components/confirmation-form";

interface EventPublicPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EventPublicPage = async ({ params }: EventPublicPageProps) => {
  const { id } = await params;

  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, id),
  });

  if (!event || !event.isActive) {
    notFound();
  }

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {/* IMAGEM */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={
              event.imageUrl?.trim() ||
              "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop"
            }
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="space-y-6 p-6 md:p-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>

            {event.description && (
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <CalendarDays className="text-primary h-5 w-5" />
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Data do evento</p>

                <strong>
                  {new Date(event.date).toLocaleDateString("pt-BR")} às{" "}
                  {event.time}
                </strong>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <MapPin className="text-primary h-5 w-5" />
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Local</p>

                <strong>{event.location}</strong>
              </div>
            </div>
          </div>

          <Separator />

          {/* FORM */}
          <ConfirmationForm event={event} />

          {event.confirmationDeadline ? (
            <p className="text-muted-foreground text-center text-sm">
              Confirme sua presença até{" "}
              <strong className="">
                {new Date(event.confirmationDeadline).toLocaleDateString(
                  "pt-BR",
                )}
              </strong>
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPublicPage;
