import {ChildParticipantsDto} from "./child-participants.dto";

export class ParticipantExtendedDto {
  participantId: string;
  institutionId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  howDidYouHearAboutUs: string;
  isAcceptedTerms: boolean;
  address: string;
  district: string;
  childParticipants: ChildParticipantsDto[] = [];
}
