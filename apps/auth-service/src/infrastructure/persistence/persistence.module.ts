import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './typeorm/user.schema';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { TypeOrmUserRepository } from './typeorm/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_PASSWORD', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'auth_db'),
        entities: [UserSchema],
        synchronize: configService.get('DB_SYNCHRONIZE', true),
        logging: configService.get('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSchema]),
  ],
  providers: [
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class PersistenceModule {}
