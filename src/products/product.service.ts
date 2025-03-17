import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductsEntity } from '../entities/Products';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,
  ) {}

  // find product by sku-code
  async findBySkuCode(skuCode: string) {
    const product = await this.productRepository.findOneBy({
      skuCode,
    });
    if (!product) {
      this.logger.error('product not found with this skuCode', skuCode);
      throw new NotFoundException('Product not found');
    }
    this.logger.log(`[Product]: ${JSON.stringify(product, null, 2)}`);
    return product;
  }

  // find product by id
  async findById(id: number) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      this.logger.error('product not found with this id', id);
      throw new NotFoundException('Product not found');
    }
    this.logger.log(`[Product]: ${JSON.stringify(product, null, 2)}`);
    return product;
  }

  // find all products
  async findAll(): Promise<ProductsEntity[]> {
    return this.productRepository.find();
  }

  // find all products pagination
  async paginateProducts(page = 1, limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [products, total] = await this.productRepository.findAndCount({
      order: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const [, totalLastThirtyDays] = await this.productRepository.findAndCount({
      where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
    });

    return {
      data: products,
      meta: {
        totalItems: total,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalThirtyDays: totalLastThirtyDays,
      },
    };
  }

  // find exist product by sku-code
  async findExistBySkuCode(skuCode: string | number) {
    let existProduct = null;
    if (typeof skuCode === 'string') {
      existProduct = await this.productRepository.findOneBy({ skuCode });
    } else {
      existProduct = await this.productRepository.findOneBy({
        id: Number(skuCode),
      });
    }

    if (existProduct) {
      this.logger.error(`product already exist with this skuCode ${skuCode}`);
      throw new BadRequestException(
        `Product already exist with this skuCode ${skuCode}`,
        `${skuCode}`,
      );
    }

    return false;
  }

  // create product
  async createProduct(product: ProductsEntity) {
    await this.findExistBySkuCode(product.skuCode);
    const create = this.productRepository.create(product);
    const save = await this.productRepository.save(create);

    this.logger.log('product is registered', save);
    return save;
  }

  // update product
  async updateProduct(id: number, product: ProductsEntity) {
    const previous = await this.findById(id);
    const save = await this.productRepository.save({
      ...previous,
      ...product,
    });
    this.logger.log('product is updated', save);
    return save;
  }

  // delete product
  async deleteProduct(id: number) {
    this.logger.log('product is deleted', id);
    return this.productRepository.delete(id);
  }

  // search product
  async searchProduct(name: string, page = 1, limit = 10) {
    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.name like :name', { name: `%${name}%` })
      .orWhere('product.code like :code', { code: `%${name}%` })
      .orWhere('product.skuCode like :skuCode', { skuCode: `%${name}%` })
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

  // find products ids
  async findProductsByIds(ids: (number | string)[]): Promise<ProductsEntity[]> {
    let keyFind = 'id';
    if (!ids || ids.length === 0) {
      throw new ForbiddenException('No Ids/skuCodes provided');
    }
    if (ids.every((i) => typeof i === 'string')) {
      keyFind = 'skuCode';
    }
    const products = await this.productRepository.find({
      where: { [keyFind]: In(ids as string[]) },
    });
    if (products.length < ids.length) {
      const foundIds = products.map(
        (product: ProductsEntity) => product[keyFind],
      );
      const missingIds = ids.filter(
        (id: string | number) => !foundIds.includes(id),
      );
      console.log('missingIds', missingIds);

      if (missingIds.length > 0) {
        throw new BadRequestException(
          `The following products were not found: [${missingIds.join(', ')}]`,
        );
      } else {
        throw new BadRequestException(
          `The following products were duplicate: []`,
        );
      }
    }

    this.logger.log('products are found', products);
    return products;
  }
}
