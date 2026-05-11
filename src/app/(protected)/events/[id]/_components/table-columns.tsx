"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmationsTable } from "@/db/schema";
import { formatPhoneNumber } from "@/helpers/phone";

export type Confirmation = typeof confirmationsTable.$inferSelect;

export const confirmationsTableColumns: ColumnDef<Confirmation>[] = [
  {
    // Name
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original.name;

      return <div className="truncate text-left">{name}</div>;
    },
  },

  // Phone
  {
    id: "phone",
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Telefone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const phoneNumber = row.original.phone;
      return formatPhoneNumber(phoneNumber);
    },
  },

  // Adults count
  {
    id: "adultsCount",
    accessorKey: "adultsCount",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Acompanhantes (Adultos)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const adultsCount = row.original.adultsCount;
      if (adultsCount === 0) {
        return "Nenhum adulto confirmado";
      }
      return <div className="text-right">{adultsCount}</div>;
    },
  },

  // Children count
  {
    id: "childrenCount",
    accessorKey: "childrenCount",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Crianças
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right">{row.original.childrenCount}</div>;
    },
  },

  // Total count
  {
    id: "totalCount",
    accessorKey: "totalCount",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const adultsCount = row.original.adultsCount || 0;
      const childrenCount = row.original.childrenCount || 0;
      return (
        <div className="text-right">{adultsCount + childrenCount + 1}</div>
      );
    },
  },
];
