import {ClassLocationsByLocationTypeDto} from "./class-locations-by-location-type.dto";

export class ClassLocationsDto {
  locationType: string;
  locations: ClassLocationsByLocationTypeDto[] = [];
}
