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
import { ProductsEntity } from '../entities/Products';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-products')
  async create(@Body() payload: ProductsEntity) {
    return this.productService.createProduct(payload);
  }

  @Put('/update-products/:id')
  async update(@Param('id') id: number, @Body() payload: ProductsEntity) {
    return this.productService.updateProduct(id, payload);
  }

  @Delete('/delete-products/:id')
  async delete(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('/product/:id')
  async getById(@Param('id') id: number) {
    return this.productService.findById(id);
  }

  @Get()
  async getAllProductsPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.productService.paginateProducts(page, limit);
  }

  @Get('/search-products')
  async searchProducts(@Query('search') search: string) {
    return this.productService.searchProduct(search);
  }

  @Get('/multiple-products')
  async getProductById(@Query('ids') ids: string) {
    const idsArray = ids.split(',').map((id) => {
      if (typeof id === 'string') {
        return id;
      }
      return parseInt(id, 10);
    });
    return this.productService.findProductsByIds(idsArray);
  }
}
