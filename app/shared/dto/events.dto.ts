import {EventDayDto} from "./event-day.dto";

export class EventDto {
  public eventId: string;
  public locationId: string;
  public termId: string;
  public courseName: string;
  public startDate: Date;
  public endDate: Date;
  public startTime: number;
  public price: number;
  public language: string;
  public courseTreeId: string;
  public eventDays: EventDayDto[] = [];
}
