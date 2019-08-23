import {LocationDto} from "./location.dto";

export class ClassLocationsByLocationTypeDto {
  locationType: string;
  locations: LocationDto[] = [];
}
