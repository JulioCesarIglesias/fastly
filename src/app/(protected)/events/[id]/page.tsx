import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  Baby,
  Calendar,
  CheckCheck,
  ExternalLink,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { confirmationsTable, eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { confirmationsTableColumns } from "../[id]/_components/table-columns";
import CopyEventLinkButton from "./_components/copy-event-link-button";
import UpdateEventButton from "./_components/update-event-button";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EventPage = async ({ params }: EventPageProps) => {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, id),
  });

  if (!event) {
    notFound();
  }

  const confirmations = await db.query.confirmationsTable.findMany({
    where: eq(confirmationsTable.eventId, id),
  });

  const totalConfirmations = confirmations.length;

  const totalAdults = confirmations.reduce(
    (acc, confirmation) => acc + 1 + confirmation.adultsCount,
    0,
  );

  const totalChildren = confirmations.reduce(
    (acc, confirmation) => acc + (confirmation.childrenCount ?? 0),
    0,
  );

  const totalPeople = totalAdults + totalChildren;

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <PageHeaderContent>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="icon">
                <Link href="/events">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>

              <div>
                <PageTitle>{event.title}</PageTitle>

                <PageDescription>
                  Gerencie seu evento e as confirmações.
                </PageDescription>
              </div>
            </div>
          </PageHeaderContent>

          <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
            <CopyEventLinkButton eventId={event.id} />

            <Button asChild>
              <Link href={`/e/${event.id}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir página pública
              </Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          {/* SIDEBAR EVENTO */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle>Informações</CardTitle>

              {/* <Button size="icon" variant="outline">
                <Pencil className="h-4 w-4" />
              </Button> */}

              <UpdateEventButton event={event} />
            </CardHeader>

            <CardContent className="space-y-6">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-48 w-full rounded-lg object-cover"
                />
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">Título</p>

                  <p className="font-medium">{event.title}</p>
                </div>

                {event.description && (
                  <div>
                    <p className="text-muted-foreground text-sm">Descrição</p>

                    <p className="text-sm">{event.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />

                  <span>
                    {new Date(event.date).toLocaleDateString("pt-BR")} às{" "}
                    {event.time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />

                  <span>{event.location}</span>
                </div>

                <div className="flex flex-col items-center gap-2 text-sm">
                  <span className="font-semibold">Limites por convite</span>

                  <Separator className="my-2" />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-muted-foreground h-4 w-4 shrink-0" />

                  <span>Adultos: {event.maxAdults}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Baby className="text-muted-foreground h-4 w-4 shrink-0" />

                  <span>
                    Crianças:{" "}
                    {event.allowChildren
                      ? `Permitido • ${event.maxChildren}`
                      : "Não permitido"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CONTEÚDO */}
          <div className="min-w-0 space-y-6">
            {/* MÉTRICAS */}
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                      Confirmações
                    </p>

                    <strong className="text-2xl">{totalConfirmations}</strong>
                  </div>

                  <UserCheck className="text-muted-foreground h-8 w-8" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                      Adultos (Total)
                    </p>

                    <strong className="text-2xl">{totalAdults}</strong>
                  </div>

                  <Users className="text-muted-foreground h-8 w-8" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Crianças</p>

                    <strong className="text-2xl">{totalChildren}</strong>
                  </div>

                  <Baby className="text-muted-foreground h-8 w-8" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                      Total pessoas
                    </p>

                    <strong className="text-2xl">{totalPeople}</strong>
                  </div>

                  <CheckCheck className="text-muted-foreground h-8 w-8" />
                </CardContent>
              </Card>
            </div>

            {/* TABELA */}
            {confirmations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <CheckCheck className="text-muted-foreground h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    Nenhuma confirmação cadastrada
                  </h3>

                  <p className="text-muted-foreground mt-2 text-center text-sm">
                    Ninguém confirmou presença ainda nesse evento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <CardContent className="px-5">
                  <div className="overflow-x-auto">
                    <DataTable
                      columns={confirmationsTableColumns}
                      data={confirmations}
                      showExport
                      exportFileName={`Confirmações - ${event.title}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default EventPage;
