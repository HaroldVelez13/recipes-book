import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // * use 3306 for mySQL,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true, // TODO: switch to false in prod & use migrations instead !

  migrationsTableName: 'migrations',
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
};
