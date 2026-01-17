import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsTypeOrmRepository } from './films-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    FilmsMemoryRepository,
    FilmsTypeOrmRepository,
    {
      provide: 'IFilmsRepository',
      useFactory: (
        configService: ConfigService,
        memoryRepo: FilmsMemoryRepository,
        typeormRepo: FilmsTypeOrmRepository,
      ) => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        return driver === 'postgresql' ? typeormRepo : memoryRepo;
      },
      inject: [ConfigService, FilmsMemoryRepository, FilmsTypeOrmRepository],
    },
  ],
  exports: ['IFilmsRepository'],
})
export class RepositoryModule {}
