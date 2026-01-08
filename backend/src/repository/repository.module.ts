import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongoRepository } from './films-mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    FilmsMemoryRepository,
    FilmsMongoRepository,
    {
      provide: 'IFilmsRepository',
      useFactory: (
        configService: ConfigService,
        memoryRepo: FilmsMemoryRepository,
        mongoRepo: FilmsMongoRepository,
      ) => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        return driver === 'mongodb' ? mongoRepo : memoryRepo;
      },
      inject: [ConfigService, FilmsMemoryRepository, FilmsMongoRepository],
    },
  ],
  exports: ['IFilmsRepository'],
})
export class RepositoryModule {}
