export class EventDayExtendedCampDto {
  eventDayId: string;
  eventDayDate: string;
  eventDayStartTime: string;
  eventDayEndTime: string;
  name: string;
  isSelected: boolean;
  isMaxNumParticipantExceeded: boolean;
  numOfRegistered: number;
  maxNumParticipants: number;
  freePlaceLeft: number;
  isWholeDay: boolean;
  price: number;
}
