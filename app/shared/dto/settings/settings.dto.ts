import { InstitutionDto } from '../institution/institution.dto';

export class SettingsDto {
  serverTime: number;
  serverTimeOffset: number;
  defaultInstitution: string;
  defaultLanguage: string;
  institutions: InstitutionDto[];
}
