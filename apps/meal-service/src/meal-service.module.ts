import { Module } from '@nestjs/common';
import { MealServiceController } from './meal-service.controller';
import { MealServiceService } from './meal-service.service';

@Module({
  imports: [],
  controllers: [MealServiceController],
  providers: [MealServiceService],
})
export class MealServiceModule {}
