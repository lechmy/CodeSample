import {EventsGroupByAgeCampDto} from "./events-group-by-age-camp.dto";

export class EventsGroupByWeekCampDto {
  numOfWeek: number;
  weekInfo: string;
  eventsGroupByAgeCamp: EventsGroupByAgeCampDto[] = [];
}
