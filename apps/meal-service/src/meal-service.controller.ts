import { Controller, Get } from '@nestjs/common';
import { MealServiceService } from './meal-service.service';

@Controller()
export class MealServiceController {
  constructor(private readonly mealServiceService: MealServiceService) {}

  @Get()
  getHello(): string {
    return this.mealServiceService.getHello();
  }
}
