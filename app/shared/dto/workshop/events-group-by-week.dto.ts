import {EventExtendedGroupByDateDto} from "./event-extended-group-by-date.dto";

export class EventsGroupByWeekDto {
  numOfWeek: number;
  weekInfo: string;
  eventsByDate: EventExtendedGroupByDateDto[] = [];
}
