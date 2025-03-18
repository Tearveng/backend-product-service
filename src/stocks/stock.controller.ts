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

  //   @Get('/multiple-products')
  //   async getProductById(@Query('ids') ids: string) {
  //     const idsArray = ids.split(',').map((id) => {
  //       if (typeof id === 'string') {
  //         return id;
  //       }
  //       return parseInt(id, 10);
  //     });
  //     return this.productService.findProductsByIds(idsArray);
  //   }
}
