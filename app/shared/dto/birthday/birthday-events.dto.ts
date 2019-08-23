import {EventsGroupByDateDto} from "./events-group-by-date.dto";
import {BirthdayExtraDto} from "./birthday-extra.dto";
import {BirthdayActivityDto} from "./birthday-activity.dto";

export class BirthdayEventsDto {
  location: string;
  eventsGroupByDate: EventsGroupByDateDto[] = [];
  birthdayPackages: BirthdayExtraDto[] = [];
  birthdayExtras: BirthdayExtraDto[] = [];
  birthdayActivities: BirthdayActivityDto[] = [];
}
