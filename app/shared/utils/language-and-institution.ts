import { InstitutionDto } from '../dto/institution/institution.dto';

export function prefixRoute(commands: any[]|string, language: string, shortName: string) : any[] {
  if (commands != null) {
    commands = Array.isArray(commands) ? commands : [commands];
  } else {
    commands = [];
  }

  const result = Object.assign([], commands);

  language = !language ? 'null' : language;
  shortName = !shortName ? 'null' : shortName;

  let base = result.shift();
  base = !base ? '' : base;
  base = `/${language}/${shortName}${base}`;

  result.unshift(base);

  return result;
}

export function getInstitutionByShortName(shortName: string, institutions: InstitutionDto[]): InstitutionDto {
  let result = null;
  for (let institution of institutions) {
    if (shortName.toLowerCase() === institution.shortName.toLowerCase()) {
      result = institution;
      break;
    }
  }
  return result;
}

export function getInstitutionById(institutionId: string, institutions: InstitutionDto[]): InstitutionDto {
  let result = null;
  for (let institution of institutions) {
    if (institutionId === institution.institutionId) {
      result = institution;
      break;
    }
  }
  return result;
}
