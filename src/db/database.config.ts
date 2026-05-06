import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const databaseConfig: DataSourceOptions = {
  type: 'sqlite',
  database: path.join(process.cwd(), 'data', 'app.db'),
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};
