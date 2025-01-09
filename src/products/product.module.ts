import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../entities/Products';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
