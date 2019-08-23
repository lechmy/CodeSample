import {EventsGroupByCourseTreeIdDto} from "./events-group-by-course-tree-id.dto";

export class EventsGroupByCourseTypeDto {
  courseType: string;
  info: string;
  eventsByCourseTreeId: EventsGroupByCourseTreeIdDto[] = [];
}
