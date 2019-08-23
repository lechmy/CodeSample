import {EventsGroupByWeekCampDto} from "./events-group-by-week-camp.dto";

export class EventsGroupByTermDto {
  termId: string;
  termName: string;
  campDescription: string;
  eventsGroupByWeekCamp: EventsGroupByWeekCampDto[] = [];
}
