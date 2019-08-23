import {EventDto} from "./event.dto";

export class EventExtendedGroupByStartTimeDto {
  courseType: string;
  startTime: string;
  endTime: string;
  courseName: string;
  eventName: string;
  eventDescription: string;
  events: EventDto[] = [];
}
