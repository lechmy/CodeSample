import {EventsGroupByStartTimeCampDto} from "./events-group-by-start-time-camp.dto";

export class EventsGroupByAgeCampDto {
  age: string;
  ageYear: string;
  campNames: string;
  eventsGroupByStartTimeCamp: EventsGroupByStartTimeCampDto[] = [];
}
