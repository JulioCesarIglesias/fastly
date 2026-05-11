import { eq } from "drizzle-orm";
import { PartyPopper } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
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

import AddEventButton from "./_components/add-event-button";
import EventsTable from "./_components/events-table";

const EventsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const events = await db.query.eventsTable.findMany({
    where: eq(eventsTable.userId, session.user.id),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Eventos</PageTitle>
          <PageDescription>Gerencie seus eventos</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddEventButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center">
              <PartyPopper className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum evento cadastrado
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Adicione seu primeiro evento para começar
            </p>
          </div>
        ) : (
          // <DataTable columns={eventTableColumns} data={events} />
          <EventsTable events={events} />
        )}
      </PageContent>
    </PageContainer>
  );
};

export default EventsPage;
