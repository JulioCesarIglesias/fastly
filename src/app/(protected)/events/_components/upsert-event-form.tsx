"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertEvent } from "@/actions/event/upsert";
import { upsertEventSchema } from "@/actions/event/upsert/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { eventsTable } from "@/db/schema";
import { cn } from "@/lib/utils";

type FormSchema = z.infer<typeof upsertEventSchema>;

interface UpsertEventFormProps {
  isOpen: boolean;
  event?: typeof eventsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertEventForm = ({
  isOpen,
  event,
  onSuccess,
}: UpsertEventFormProps) => {
  const form = useForm<FormSchema>({
    // shouldUnregister: true,
    resolver: zodResolver(upsertEventSchema),

    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: "",
      location: "",
      confirmationDeadline: undefined,
      imageUrl: "",
      maxAdults: 0,
      allowChildren: false,
      maxChildren: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: event?.title ?? "",
        description: event?.description ?? "",
        date: event?.date ? new Date(event.date) : undefined,
        time: event?.time ?? "",
        location: event?.location ?? "",
        confirmationDeadline: event?.confirmationDeadline
          ? new Date(event.confirmationDeadline)
          : undefined,
        imageUrl: event?.imageUrl ?? "",
        maxAdults: event?.maxAdults ?? 0,
        allowChildren: event?.allowChildren ?? false,
        maxChildren: event?.maxChildren ?? 0,
        isActive: event?.isActive ?? true,
      });
    }
  }, [isOpen, event, form]);

  const allowChildren = form.watch("allowChildren");

  const upsertEventAction = useAction(upsertEvent, {
    onSuccess: () => {
      toast.success(
        event ? "Evento atualizado com sucesso." : "Evento criado com sucesso.",
      );

      onSuccess?.();
    },

    onError: () => {
      toast.error(
        event ? "Erro ao atualizar evento." : "Erro ao criar evento.",
      );
    },
  });

  const onSubmit = (values: FormSchema) => {
    upsertEventAction.execute({
      ...values,
      id: event?.id,
    });
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{event ? "Editar evento" : "Novo evento"}</DialogTitle>

        <DialogDescription>
          {event
            ? "Edite as informações do evento."
            : "Preencha as informações do evento."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>

                <FormControl>
                  <Input placeholder="Ex: Festa de aniversário" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Descrição do evento"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do evento</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? field.value.toLocaleDateString("pt-BR")
                          : "Selecione uma data"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>

                <FormControl>
                  <Input
                    type="time"
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>

                <FormControl>
                  <Input placeholder="Digite o local do evento" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmationDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Prazo de confirmação</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? field.value.toLocaleDateString("pt-BR")
                          : "Selecione uma data"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  URL da imagem{" "}
                  <span className="text-muted-foreground">(1600x900)</span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAdults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de adultos</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowChildren"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel>Permitir crianças?</FormLabel>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {allowChildren && (
            <FormField
              control={form.control}
              name="maxChildren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de crianças</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <DialogFooter>
            <Button type="submit">
              {upsertEventAction.isPending
                ? "Salvando..."
                : event
                  ? "Salvar alterações"
                  : "Criar evento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertEventForm;
