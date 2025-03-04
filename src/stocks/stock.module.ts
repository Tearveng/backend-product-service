import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksEntity } from 'src/entities/Stocks';
import { ProductModule } from 'src/products/product.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([StocksEntity]), ProductModule],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
