import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files, e.g., from the 'public' directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/', // optional: prefix path for public assets
  });

  // Enable CORS for specific origins
  app.enableCors({
    origin: '*',
  });

  // set up swagger
  const config = new DocumentBuilder()
    .setTitle('Product API document')
    .setDescription('Product api endpoint connecting...')
    .setVersion('1.0')
    .addTag('products')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: '.swagger-ui { background-color: #f5f5f5; }', // Custom CSS
    // customJs: '/public/swagger-custom.js', // Custom JS (if needed)
    customSiteTitle: 'Swagger - Products', // Custom site title
  }); // This will expose Swagger UI at /api
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
