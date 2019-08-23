import {EventDayDto} from "../event-day.dto";
import {BirthdayExtraDto} from "./birthday-extra.dto";
import {BirthdayActivityDto} from "./birthday-activity.dto";

export class BirthdayEventDto {
  title: string;
  termId: string;
  courseName: string;
  location: string;
  startDate: Date;
  startTime: number;
  endTime: number;
  price: number;
  dayInfo: string;
  eventDay: EventDayDto;
  eventDayId: string;

  additionalNumberOfChildren: number;
  areParentsWelcome: boolean;
  averageAge: string;
  birthdayPackage: BirthdayExtraDto;
  birthdayExtras: BirthdayExtraDto[] = [];
  birthdayActivity: BirthdayActivityDto;
  language: string;
}
