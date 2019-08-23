import {EventsGroupByTermDto} from "./events-group-by-term.dto";

export class CampEventsDto {
  location: string;
  campDescription: string;
  eventsGroupByTerm: EventsGroupByTermDto[] = [];
}
