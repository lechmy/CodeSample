export class ClassEnrollmentModel{
  institutionId: string;
  eventId: string;
  eventDayIds: string[] = [];
  participantId: string;
  childParticipantIds: string[] = [];
  code: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  district: string;
  howDidYouHearAboutUs: string;
  isAcceptedTerms: boolean;

  childFirstName: string;
  childLastName: string;
  gender: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  languageSpoken: string;
  note: string;
}
