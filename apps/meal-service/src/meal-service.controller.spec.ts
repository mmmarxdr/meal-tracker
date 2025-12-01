import { Test, TestingModule } from '@nestjs/testing';
import { MealServiceController } from './meal-service.controller';
import { MealServiceService } from './meal-service.service';

describe('MealServiceController', () => {
  let mealServiceController: MealServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MealServiceController],
      providers: [MealServiceService],
    }).compile();

    mealServiceController = app.get<MealServiceController>(MealServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mealServiceController.getHello()).toBe('Hello World!');
    });
  });
});
