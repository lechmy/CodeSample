import {EventDaysExtendedCampGroupByDateDto} from "./event-days-extended-camp-group-by-date.dto";

export class EventExtendedCampDto {
  eventId: string;
  eventDayId: string;
  eventDayDate: string;
  eventDayStartTime: string;
  eventDayEndTime: string;
  isTerminOccupied: boolean;
  isWholeDay: boolean;
  courseType: string;
  courseGroup: string;
  courseName: string;
  subTitle: string;
  numOfRegistered: number;
  numOfWaiting: number;
  numOfCanceled: number;
  numOfWeek: number;
  weekInfo: string;
  campOnlyWeekly: boolean;
  language: string;
  isBookable: boolean;
  eventDiscounts: string[] = [];
  eventDaysExtendedCampGroupByDate: EventDaysExtendedCampGroupByDateDto[] = [];
}
