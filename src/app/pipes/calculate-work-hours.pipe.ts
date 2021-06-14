import { Pipe, PipeTransform } from '@angular/core';
import { indexOf } from "lodash";

@Pipe({
  name: 'calculateWorkHours'
})

export class CalculateWorkHoursPipe implements PipeTransform {

  transform(hoursOfTheDay: string[], workingHours: string): boolean {
    return indexOf(hoursOfTheDay, workingHours) === -1;
  }

}
