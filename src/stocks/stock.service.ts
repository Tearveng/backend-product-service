import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StocksEntity } from 'src/entities/Stocks';
import { ProductService } from 'src/products/product.service';
import { omit } from 'src/utils/RemoveAttribute';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(StocksEntity)
    private readonly stockRepository: Repository<StocksEntity>,
    private readonly productService: ProductService,
  ) {}

  //   // find product by sku-code
  //   async findBySkuCode(skuCode: string) {
  //     const product = await this.productRepository.findOneBy({
  //       skuCode,
  //     });
  //     if (!product) {
  //       this.logger.error('product not found with this skuCode', skuCode);
  //       throw new NotFoundException('Product not found');
  //     }
  //     this.logger.log(`[Product]: ${JSON.stringify(product, null, 2)}`);
  //     return product;
  //   }

  // find stock by id
  async findById(id: number) {
    const stock = await this.stockRepository.findOneBy({
      id,
    });
    if (!stock) {
      this.logger.error('stock not found with this id', id);
      throw new NotFoundException('Stock not found');
    }
    this.logger.log(`[Product]: ${JSON.stringify(stock, null, 2)}`);
    return stock;
  }

  // find all stocks
  async findAll(): Promise<StocksEntity[]> {
    return this.stockRepository.find();
  }

  // find stocks tyoe
  findStockByType = (type: string) => {
    return ['STOCK', 'PRE-STOCK', 'LIVE'].indexOf(type) > -1;
  };

  // find all stocks pagination
  async paginateStocks(page = 1, limit = 10, type: string = 'STOCK') {
    const correctType = this.findStockByType(type);
    if (!correctType) {
      this.logger.log(`stock type not found: ${type}`);
      throw new BadRequestException(`Stock type not found: ${type}`);
    }

    const [stocks, total] = await this.stockRepository.findAndCount({
      order: {
        createdAt: 'desc',
      },
      where: { type },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: stocks,
      meta: {
        totalItems: total,
        itemCount: stocks.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  //   // find exist product by sku-code
  //   async findExistBySkuCode(skuCode: string | number) {
  //     let existProduct = null;
  //     if (typeof skuCode === 'string') {
  //       existProduct = await this.productRepository.findOneBy({ skuCode });
  //     } else {
  //       existProduct = await this.productRepository.findOneBy({
  //         id: Number(skuCode),
  //       });
  //     }

  //     if (existProduct) {
  //       this.logger.error(`product already exist with this skuCode ${skuCode}`);
  //       throw new BadRequestException(
  //         `Product already exist with this skuCode ${skuCode}`,
  //         `${skuCode}`,
  //       );
  //     }

  //     return false;
  //   }

  // create stock
  async createStock(product: StocksEntity) {
    const getById = await this.productService.findByCode(product.code);
    console.log(
      "omit(getById, 'createdAt', 'updatedAt')",
      omit(getById, 'createdAt', 'updatedAt'),
    );
    const create = this.stockRepository.create({
      ...omit(getById, 'id', 'createdAt', 'updatedAt'),
      ...product,
    });
    console.log('create', create);
    const save = await this.stockRepository.save(create);
    this.logger.log('stock is registered', save);
    return save;
  }

  // update stock
  async updateStock(id: number, product: StocksEntity) {
    const previous = await this.findById(id);
    const save = await this.stockRepository.save({
      ...previous,
      ...product,
    });
    this.logger.log('stock is updated', save);
    return save;
  }

  // delete stock
  async deleteStock(id: number) {
    this.logger.log('stock is deleted', id);
    return this.stockRepository.delete(id);
  }

  // search stock
  async searchStock(name: string, type: string, page = 1, limit = 10) {
    const [products, total] = await this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.type', { type })
      .where('stock.name like :name', { name: `%${name}%` })
      .orWhere('stock.code like :code', { code: `%${name}%` })
      // .orWhere('product.skuCode like :skuCode', { skuCode: `%${name}%` })
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    return {
      data: products,
      meta: {
        totalItems: total,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  //   // find products ids
  //   async findProductsByIds(ids: (number | string)[]): Promise<ProductsEntity[]> {
  //     let keyFind = 'id';
  //     if (!ids || ids.length === 0) {
  //       throw new ForbiddenException('No Ids/skuCodes provided');
  //     }
  //     if (ids.every((i) => typeof i === 'string')) {
  //       keyFind = 'skuCode';
  //     }
  //     const products = await this.productRepository.find({
  //       where: { [keyFind]: In(ids as string[]) },
  //     });
  //     if (products.length < ids.length) {
  //       const foundIds = products.map(
  //         (product: ProductsEntity) => product[keyFind],
  //       );
  //       const missingIds = ids.filter(
  //         (id: string | number) => !foundIds.includes(id),
  //       );
  //       console.log("missingIds", missingIds)

  //       if (missingIds.length > 0) {
  //         throw new BadRequestException(
  //           `The following products were not found: [${missingIds.join(', ')}]`,
  //         );
  //       }else {
  //         throw new BadRequestException(
  //           `The following products were duplicate: []`,
  //         );
  //       }
  //     }

  //     this.logger.log('products are found', products);
  //     return products;
  //   }
}
