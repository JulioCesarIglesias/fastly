"use client";

import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";

import { Event, eventTableColumns } from "./table-columns";

interface EventsTableProps {
  events: Event[];
}

const EventsTable = ({ events }: EventsTableProps) => {
  const router = useRouter();

  return (
    <DataTable
      columns={eventTableColumns}
      data={events}
      onRowClick={(event) => router.push(`/events/${event.id}`)}
    />
  );
};

export default EventsTable;
