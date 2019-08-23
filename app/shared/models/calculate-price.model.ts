export class CalculatePriceModel {
  institutionId: string;
  eventId: string;
  eventDayIds: string[] = [];
  participantId: string;
  childParticipantIds: string[] = [];
  birthdayPackageId: string;
  birthdayExtraIds: string[] = [];
  code: string;
}
