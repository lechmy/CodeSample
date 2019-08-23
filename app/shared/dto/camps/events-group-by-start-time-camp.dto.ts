import {EventExtendedCampDto} from "./event-extended-camp.dto";

export class EventsGroupByStartTimeCampDto {
  startTime: string;
  description: string;
  events: EventExtendedCampDto[] = [];
}
