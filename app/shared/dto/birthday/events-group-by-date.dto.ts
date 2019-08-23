import {EventDayExtendedBirthdayDto} from "./event-day-extended-birthday.dto";

export class EventsGroupByDateDto {
  date: string;
  isBookable: boolean;
  eventDays: EventDayExtendedBirthdayDto[] = [];
}
