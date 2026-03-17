import * as dotenv from 'dotenv';
dotenv.config();

import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';

const config: Options<MongoDriver> = {
  driver: MongoDriver,
  clientUrl: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
};

export default config;
