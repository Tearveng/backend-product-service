import { registerAs } from '@nestjs/config';
import { StocksEntity } from 'src/entities/Stocks';
import { ProductsEntity } from '../entities/Products';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, //'eiii_kommerce'
  entities: [ProductsEntity, StocksEntity],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'product_migrations',
}));
