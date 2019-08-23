import {EventCalendarDto} from "./event-calendar.dto";

export class EventsCalendarDto {
  dayStartHour: number;
  dayEndHour: number;
  events: EventCalendarDto[] = [];
}
