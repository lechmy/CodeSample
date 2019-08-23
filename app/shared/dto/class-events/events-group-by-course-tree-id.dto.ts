import {EventsGroupByStartTimeEndTimeDto} from "./events-group-by-start-time-end-time.dto";

export class EventsGroupByCourseTreeIdDto {
  courseTreeId: string;
  courseImageUrl: string;
  name: string;
  subTitle: string;
  description: string;
  eventsByStartTimeEndTime: EventsGroupByStartTimeEndTimeDto[] = [];
}
