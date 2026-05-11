"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Minus,
  PartyPopper,
  Plus,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { insertConfirmation } from "@/actions/confirmation/insert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { eventsTable } from "@/db/schema";

const formSchema = z.object({
  name: z.string().trim().min(3, {
    message: "Digite seu nome completo.",
  }),

  phone: z.string().trim().min(10, {
    message: "Digite um telefone válido.",
  }),

  adultsCount: z.number().min(0),

  childrenCount: z.number().min(0),
});

interface ConfirmationFormProps {
  event: typeof eventsTable.$inferSelect;
}

const ConfirmationForm = ({ event }: ConfirmationFormProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [confirmationData, setConfirmationData] = useState<{
    name: string;
    phone: string;
    adultsCount: number;
    childrenCount: number;
    alreadyExists?: boolean;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      phone: "",
      adultsCount: 0,
      childrenCount: 0,
    },
  });

  const confirmationExpired = useMemo(() => {
    if (!event.confirmationDeadline) {
      return false;
    }

    return new Date() > new Date(event.confirmationDeadline);
  }, [event.confirmationDeadline]);

  const insertConfirmationAction = useAction(insertConfirmation, {
    onSuccess: ({ data }) => {
      if (!data?.confirmation) return;

      setConfirmationData({
        name: data.confirmation.name,
        phone: data.confirmation.phone,
        adultsCount: data.confirmation.adultsCount ?? 0,
        childrenCount: data.confirmation.childrenCount ?? 0,
        alreadyExists: data.alreadyExists,
      });

      setModalOpen(true);

      toast.success(
        data.alreadyExists
          ? "Confirmação atualizada com sucesso."
          : "Presença confirmada com sucesso.",
      );
    },

    onError: ({ error }) => {
      const message =
        error.serverError ||
        error.validationErrors?._errors?.[0] ||
        "Erro ao confirmar presença.";

      toast.error(message);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (confirmationExpired) {
      toast.error("Prazo de confirmação encerrado.");

      return;
    }

    insertConfirmationAction.execute({
      eventId: event.id,
      ...values,
    });
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Confirmar presença
          </h2>

          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para confirmar sua participação.
          </p>
        </div>

        {confirmationExpired && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            O prazo de confirmação deste evento foi encerrado.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      disabled={confirmationExpired}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>

                  <FormControl>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      value={field.value}
                      disabled={confirmationExpired}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      customInput={Input}
                      placeholder="(00) 00000-0000"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={`grid gap-4 ${
                event.allowChildren ? "sm:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {/* ADULTOS */}
              <FormField
                control={form.control}
                name="adultsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acompanhantes adultos</FormLabel>

                    <FormControl>
                      <div className="flex items-center justify-evenly rounded-2xl border p-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          disabled={confirmationExpired || field.value <= 0}
                          onClick={() =>
                            field.onChange(Math.max(0, field.value - 1))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="text-center">
                          <strong className="text-3xl font-bold">
                            {field.value}
                          </strong>

                          <p className="text-muted-foreground text-xs">
                            acompanhantes
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          disabled={
                            confirmationExpired ||
                            field.value >= event.maxAdults
                          }
                          onClick={() =>
                            field.onChange(
                              Math.min(event.maxAdults, field.value + 1),
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>

                    <p className="text-muted-foreground text-xs">
                      Máximo permitido: {event.maxAdults}
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CRIANÇAS */}
              {event.allowChildren && (
                <FormField
                  control={form.control}
                  name="childrenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acompanhantes crianças</FormLabel>

                      <FormControl>
                        <div className="flex items-center justify-evenly rounded-2xl border p-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            disabled={confirmationExpired || field.value <= 0}
                            onClick={() =>
                              field.onChange(Math.max(0, field.value - 1))
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <div className="text-center">
                            <strong className="text-3xl font-bold">
                              {field.value}
                            </strong>

                            <p className="text-muted-foreground text-xs">
                              acompanhantes
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            disabled={
                              confirmationExpired ||
                              field.value >= (event.maxChildren ?? 0)
                            }
                            onClick={() =>
                              field.onChange(
                                Math.min(
                                  event.maxChildren ?? 0,
                                  field.value + 1,
                                ),
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>

                      <p className="text-muted-foreground text-xs">
                        Máximo permitido: {event.maxChildren ?? 0}
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full text-base"
              disabled={
                confirmationExpired || insertConfirmationAction.isPending
              }
            >
              {insertConfirmationAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando presença...
                </>
              ) : confirmationExpired ? (
                "Prazo encerrado"
              ) : (
                <>
                  <PartyPopper className="mr-2 h-4 w-4" />
                  Confirmar presença
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-lg">
          {/* CONTEÚDO */}
          {confirmationData && (
            <div className="space-y-6 p-6">
              {/* TOPO */}
              <div className="from-primary/10 via-primary/5 px-6 pt-8 pb-6">
                <DialogHeader className="items-center text-center">
                  <div className="bg-primary/10 mb-5 flex h-24 w-24 items-center justify-center rounded-full border">
                    <PartyPopper className="text-primary h-12 w-12" />
                  </div>

                  <DialogTitle className="text-3xl font-bold tracking-tight">
                    Presença confirmada!
                  </DialogTitle>

                  <DialogDescription className="text-muted-foreground mt-3 max-w-sm text-base leading-relaxed">
                    <strong className="text-base">
                      {confirmationData.name}
                    </strong>
                    , obrigado pela confirmação! Estamos muito felizes com a sua
                    presença e já estamos ansiosos para compartilhar esse
                    momento especial com você.
                  </DialogDescription>
                </DialogHeader>
              </div>
              {/* INFORMAÇÕES DO EVENTO */}
              <div className="rounded-2xl border p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
                  Informações do evento
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <CalendarDays className="text-primary h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm">
                        Data e horário
                      </p>

                      <strong>
                        {dayjs(event.date).format("DD/MM/YYYY")} às {event.time}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm">Local</p>

                      <strong>{event.location}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="h-11 w-full"
                onClick={() => setModalOpen(false)}
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationForm;
