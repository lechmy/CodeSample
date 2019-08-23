import {EventExtendedGroupByStartTimeDto} from "./event-extended-group-by-start-time.dto";

export class EventExtendedGroupByDateDto {
  startDate: Date;
  eventsByStartTime: EventExtendedGroupByStartTimeDto[] = [];
}
