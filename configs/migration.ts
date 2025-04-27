import 'dotenv/config';
import 'reflect-metadata';

import { join } from 'path';
import * as process from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NamingStrategy } from '../src/strategies/naming.strategy';
import { ENTITIES } from '../src/entities';

export const AppDataSourceForMigrate = new DataSource({
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ENTITIES,
  migrations: [join(__dirname + './migrations/*{.ts,.js}')],
  logging: process.env.NODE_ENV !== 'production',
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  namingStrategy: new NamingStrategy(),
} as DataSourceOptions);

console.log('Loaded DB config:', {
  engine: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
});

AppDataSourceForMigrate.initialize().then(() => {
  console.log('Metadatas:', ENTITIES);
});
