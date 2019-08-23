import {EventDayExtendedCampDto} from "./event-day-extended-camp.dto";

export class EventDaysExtendedCampGroupByDateDto {
  eventDayDate: string;
  isFullDayAvailable: boolean;
  eventDays: EventDayExtendedCampDto[] = [];
}
