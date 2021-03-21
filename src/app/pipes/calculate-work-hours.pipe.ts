import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({
  name: 'calculateWorkHours'
})

export class CalculateWorkHoursPipe implements PipeTransform {

  transform(hoursOfTheDay: string[], workingHours: string): boolean {
    return _.indexOf(hoursOfTheDay, workingHours) === -1;
  }

}
