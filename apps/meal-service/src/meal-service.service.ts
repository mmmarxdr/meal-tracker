import { Injectable } from '@nestjs/common';

@Injectable()
export class MealServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
