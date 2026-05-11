"use client";

// import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import ptBrLocale from "@fullcalendar/core/locales/pt-br.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
// import { CalendarDays, MapPin } from "lucide-react";

interface EventsCalendarProps {
  events: {
    id: string;
    title: string;
    date: Date;
    location?: string | null;
  }[];
}

const EventsCalendar = ({ events }: EventsCalendarProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          buttonText={{
            today: "Hoje",
          }}
          events={events.map((event) => ({
            id: event.id,
            title: event.title,
            start: dayjs(event.date).format("YYYY-MM-DD"),
            extendedProps: {
              location: event.location,
            },
          }))}
          eventContent={(eventInfo) => {
            return (
              <div className="rounded-md bg-black px-2 py-1 text-xs text-white">
                <p className="truncate font-medium">{eventInfo.event.title}</p>
              </div>
            );
          }}
          eventClick={(info) => {
            alert(
              `${info.event.title}\n\n📍 ${info.event.extendedProps.location}`,
            );
          }}
        />
      </div>
    </div>
  );
};

export default EventsCalendar;
