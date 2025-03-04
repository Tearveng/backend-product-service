import {
  Body,
  Controller,
  Get,
  Post,
  Query
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

//   @Put('/update-products/:id')
//   async update(@Param('id') id: number, @Body() payload: ProductsEntity) {
//     return this.productService.updateProduct(id, payload);
//   }

//   @Delete('/delete-products/:id')
//   async delete(@Param('id') id: number) {
//     return this.productService.deleteProduct(id);
//   }

//   @Get('/product/:id')
//   async getById(@Param('id') id: number) {
//     return this.productService.findById(id);
//   }

  @Get()
  async getAllStocksPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('type') type: string
  ) {
    return this.stockService.paginateStocks(page, limit, type);
  }

//   @Get('/search-products')
//   async searchProducts(@Query('search') search: string) {
//     return this.productService.searchProduct(search);
//   }

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
