"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { eventsTable } from "@/db/schema";

import UpsertEventForm from "../../_components/upsert-event-form";

const UpdateEventButton = ({
  event,
}: {
  event: typeof eventsTable.$inferSelect;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <UpsertEventForm
        isOpen={isOpen}
        onSuccess={() => setIsOpen(false)}
        event={event}
      />
    </Dialog>
  );
};

export default UpdateEventButton;
