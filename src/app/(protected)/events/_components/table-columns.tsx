"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { eventsTable } from "@/db/schema";

import EventsTableActions from "./table-actions";

export type Event = typeof eventsTable.$inferSelect;

export const eventTableColumns: ColumnDef<Event>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 🏷️ Evento
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Evento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },

  // 📅 Data
  {
    id: "date",
    accessorKey: "date",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data / Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        dayjs(row.original.date).format("DD/MM/YYYY") +
        "  " +
        row.original.time?.slice(0, 5)
      );
    },
  },

  // ⏰ Localização
  {
    id: "location",
    accessorKey: "location",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Localização
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return row.original.location;
    },
  },

  // // ⏳ Prazo de confirmação
  // {
  //   accessorKey: "confirmationDeadline",
  //   header: ({ column }) => (
  //     <div className="text-left">
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Confirmação até
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const date = row.original.confirmationDeadline;
  //     return date ? dayjs(date).format("DD/MM/YYYY") : "-";
  //   },
  // },

  // 🔘 Status
  {
    id: "isActive",
    accessorKey: "isActive",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive ? "Ativo" : "Inativo";

      return isActive === "Ativo" ? (
        <Badge variant="default" className="bg-green-600 text-white">
          {isActive}
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-red-600 text-white">
          {isActive}
        </Badge>
      );
    },
  },

  // ⚙️ Ações
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="text-right">
          <EventsTableActions event={event} />
        </div>
      );
    },
  },
];
