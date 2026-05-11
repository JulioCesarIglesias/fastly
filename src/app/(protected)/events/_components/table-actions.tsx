"use client";

import { EditIcon, Eye, MoreVerticalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteEvent } from "@/actions/event/delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eventsTable } from "@/db/schema";

import UpsertEventForm from "./upsert-event-form";

interface EventsTableActionsProps {
  event: typeof eventsTable.$inferSelect;
}

const EventsTableActions = ({ event }: EventsTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);
  const [deleteAlertIsOpen, setDeleteAlertIsOpen] = useState(false);

  const deleteEventAction = useAction(deleteEvent, {
    onSuccess: () => {
      toast.success("Evento deletado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar evento.");
    },
  });

  const handleDeleteEventClick = () => {
    deleteEventAction.execute({ id: event.id });
  };

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/events/${event.id}`}>
                <Eye className="h-4 w-4" />
                Ver
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon className="h-4 w-4" />
              Editar
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setUpsertDialogIsOpen(true);
              }}
            >
              <EditIcon className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteAlertIsOpen(true)}>
              <TrashIcon className="h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertEventForm
          isOpen={upsertDialogIsOpen}
          event={event}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>

      <AlertDialog open={deleteAlertIsOpen} onOpenChange={setDeleteAlertIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esse evento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser revertida. Isso irá deletar o evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEventClick}
              className="bg-red-500 hover:bg-red-600"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventsTableActions;
