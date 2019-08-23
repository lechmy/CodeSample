import {TermDto} from "./term.dto";
import {EventsGroupByCourseTypeDto} from "./events-group-by-course-type.dto";

export class ClassEventsDto {
  location: string;
  terms: TermDto[] = [];
  events: EventsGroupByCourseTypeDto[] = [];
}
