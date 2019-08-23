import {EventsGroupByWeekDto} from "./events-group-by-week.dto";

export class WorkshopEventsDto {
  location: string;
  events: EventsGroupByWeekDto[] = [];
}
