export class DropdownDate {
  day: number[] = [];
  month: number[] = [];
  year: number[] = [];
}

export function fillDate() {
  let date = new DropdownDate();

  for(let i=1;i<32;i++) {
    date.day.push(i);
  }

  for(let i=1;i<13;i++) {
    date.month.push(i);
  }

  const year = new Date().getFullYear();
  for(let i=year; i>year-30; i--) {
    date.year.push(i);
  }
  return date;
}

export function validateDate(day: number, month: number, year: number) {
  const validDays = {
    1: 31,
    2: year % 4 == 0 ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 31,
    7: 30,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };
  if(day <= validDays[month] && day > 0) {
    return true;
  } else {
    return false;
  }
}
