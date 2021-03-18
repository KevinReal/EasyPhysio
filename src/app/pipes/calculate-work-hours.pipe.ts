import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({
  name: 'calculateWorkHours'
})
export class CalculateWorkHoursPipe implements PipeTransform {

  transform(hoursOfTheDay: string[], workingHours: string): boolean {
    if (_.indexOf(hoursOfTheDay, workingHours) !== -1) {
      return false;
    } else {
      return true;
    }
  }

}
