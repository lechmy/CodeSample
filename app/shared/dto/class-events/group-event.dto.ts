import {EventDiscountDto} from "../event-discount.dto";

export class GroupEventDto {
  eventId: string;
  locationId: string;
  termId: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  isBookable: boolean;
  eventStatus: string;
  minNumParticipants: number;
  maxNumParticipants: number;
  expectedNumParticipants: number;
  hours: number;
  price: number;
  earlyBirdUntil: Date;
  language: string;
  eventName: string;
  eventDescription: string;
  campOnlyWeekly: boolean;
  courseTreeId: string;
  isPortalVisible: boolean;
  terminDayOfWeek: Date;
  freePlace: number;
  eventDiscounts: EventDiscountDto[] = [];
}
