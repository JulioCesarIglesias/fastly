"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertEventForm from "./upsert-event-form";

const AddEventButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </DialogTrigger>
      <UpsertEventForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddEventButton;
