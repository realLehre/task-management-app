import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten_name',
})
export class ShortenBoardName implements PipeTransform {
  transform(value: string) {
    let newValue;

    if (value.length > 20) {
      newValue = value.substring(0, 20) + '...';
    }

    return newValue;
  }
}
