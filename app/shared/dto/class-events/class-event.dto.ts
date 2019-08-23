import {EventDayDto} from "../event-day.dto";
import {EventDiscountDto} from "../event-discount.dto";

export class ClassEventDto {
  eventId: string;
  locationId: string;
  termId: string;
  courseName: string;
  locationAddress: string;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  title: string;
  price: number;
  language: string;
  courseTreeId: string;
  dayInfo: string;
  campOnlyWeekly: boolean;
  eventDays: EventDayDto[] = [];
  eventDiscounts: EventDiscountDto[] = [];
}
