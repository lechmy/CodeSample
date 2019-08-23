import {GroupEventDto} from "./group-event.dto";

export class EventsGroupByStartTimeEndTimeDto {
  monthInfo: string;
  dayInfo: string;
  priceInfo: string;
  priceInfoEarliBird: string;
  isEarliBirdActive: boolean
  events: GroupEventDto[] = [];
}
