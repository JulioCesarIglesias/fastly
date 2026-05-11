import { eq } from "drizzle-orm";
import { CalendarDays } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import EventsCalendar from "./_components/events-calendar";

const CalendarPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const events = await db.query.eventsTable.findMany({
    where: eq(eventsTable.userId, session.user.id),
    orderBy: (events, { asc }) => [asc(events.date)],
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Calendário</PageTitle>

          <PageDescription>
            Visualize seus eventos em calendário
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-20">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <CalendarDays className="text-muted-foreground h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Nenhum evento encontrado
            </h3>

            <p className="text-muted-foreground mt-2 text-sm">
              Crie um evento para visualizar no calendário
            </p>
          </div>
        ) : (
          <EventsCalendar events={events} />
        )}
      </PageContent>
    </PageContainer>
  );
};

export default CalendarPage;
