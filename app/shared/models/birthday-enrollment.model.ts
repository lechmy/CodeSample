export class BirthdayEnrollmentModel{
  institutionId: string;
  eventId: string;
  eventDayIds: string;
  participantId: string;
  childParticipantIds: string[] = [];
  code: string;

  additionalNumberOfChildren: number;
  areParentsWelcome: boolean;
  averageAge: string;
  birthdayPackageId: string;
  birthdayExtraIds: string[] = [];
  birthdayActivityId: string;
  language: string;

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
