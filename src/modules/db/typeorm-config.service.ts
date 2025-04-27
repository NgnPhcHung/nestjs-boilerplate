import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENTITIES } from 'src/entities';
import { NamingStrategy } from 'src/strategies/naming.strategy';
import { DatabaseType } from 'typeorm';

@Injectable()
export class TypeormCofigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    console.log(
      this.configService.get<string>('DATABASE_HOST'),
      this.configService.get<string>('DATABASE_PORT'),
      this.configService.get<string>('DATABASE_USER'),
      this.configService.get<string>('DATABASE_PASSWORD'),
      this.configService.get<string>('DATABASE_NAME'),
    );

    return {
      type: this.configService.get<DatabaseType | any>('DATABASE_ENGINE'),
      name: 'default',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      logging: this.configService.get<string>('NODE_ENV') !== 'production',
      entities: ENTITIES,
      namingStrategy: new NamingStrategy(),
      synchronize: false,
    };
  }
}
