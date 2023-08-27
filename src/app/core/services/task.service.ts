import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor() {}

  generateRandomString() {
    const randomChar =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567';

    let randomString = '';
    for (let d = 0; d < 20; d++) {
      randomString += randomChar.charAt(
        Math.floor(Math.random() * randomChar.length)
      );
    }
    return randomString;
  }
}
