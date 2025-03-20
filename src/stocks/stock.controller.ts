import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StocksEntity } from 'src/entities/Stocks';
import { StockService } from './stock.service';
import { Stock } from '../dto/StockDTO';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('/create-stocks')
  @ApiOperation({ summary: 'Create stock' })
  @ApiResponse({ status: 200, description: 'Stock is registered' })
  async create(@Body() payload: StocksEntity) {
    return this.stockService.createStock(payload);
  }

  @Put('/update-stocks/:id')
  async update(@Param('id') id: number, @Body() payload: StocksEntity) {
    return this.stockService.updateStock(id, payload);
  }

  @Delete('/delete-stocks/:id')
  async delete(@Param('id') id: number) {
    return this.stockService.deleteStock(id);
  }

  @Get('/stock/:id')
  async getById(@Param('id') id: number) {
    return this.stockService.findById(id);
  }

  @Get('/stock/code/:code')
  async getByCode(@Param('code') code: string) {
    return this.stockService.findByCode(code);
  }

  @Get('/stock/sku-code/:skuCode')
  async getBySkuCode(@Param('skuCode') skuCode: string) {
    return this.stockService.findBySkuCode(skuCode);
  }

  @Get()
  async getAllStocksPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('type') type: string = 'STOCK',
  ) {
    return this.stockService.paginateStocks(page, limit, type);
  }

  @Get('/search-stocks')
  async searchProducts(
    @Query('search') search: string,
    @Query('type') type: string,
  ) {
    return this.stockService.searchStock(search, type);
  }

  @Get('/multiple-stocks')
  async getStockById(@Query('ids') ids: string) {
    const idsArray = ids.split(',').map((id) => {
      if (typeof id === 'string') {
        return id;
      }
      return parseInt(id, 10);
    });
    return this.stockService.findStocksByIds(idsArray);
  }

  @Post('/stock-sold')
  async stockSold(@Body() payload: Stock[]) {
    console.log('stocks', payload);
    return this.stockService.stockSold(payload);
  }
}
