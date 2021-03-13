import dotenv from 'dotenv';
import fs from 'fs';
import getPort from 'get-port';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { SOFA_OPEN_API, SofaOpenApi } from '~/modules/sofa';
import { Adapter } from './types';
import { AppModule } from './app.module';
import { registerSofa } from './sofa';

const logger = console;
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json')).toString()
);

const rootPath = path.resolve(__dirname, '..');
dotenv.config();
const { env } = process;

const adapter =
  env.NESTJS_ADAPTER?.toLowerCase() === 'fastify'
    ? Adapter.Fastify
    : Adapter.Express;

(async () => {
  const app = await NestFactory.create<
    NestExpressApplication | NestFastifyApplication
  >(
    AppModule,
    adapter === Adapter.Fastify ? new FastifyAdapter() : new ExpressAdapter(),
    { bodyParser: true }
  );
  if (adapter === Adapter.Fastify) {
    const ejs = await import('ejs');
    const fastifyApp = app as NestFastifyApplication;
    fastifyApp.useStaticAssets({
      root: path.join(__dirname, '..', 'public'),
      prefix: '/public/'
    });
    fastifyApp.setViewEngine({
      engine: {
        handlebars: ejs
      },
      templates: path.join(__dirname, '..', 'views')
    });
  } else {
    const expressApp = app as NestExpressApplication;
    expressApp.useStaticAssets(path.resolve(rootPath, 'public'));
    expressApp.setBaseViewsDir(path.resolve(rootPath, 'views'));
    expressApp.setViewEngine('ejs');
  }
  app.useGlobalPipes(new ValidationPipe());
  const sofaOpenApi: SofaOpenApi = app.get(SOFA_OPEN_API);
  if (env.SWAGGER === '1') {
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .build();
    const openApiObject = SwaggerModule.createDocument(app, options);
    const sofaOpenApiObject = sofaOpenApi.get();
    SwaggerModule.setup('api', app, {
      ...sofaOpenApiObject,
      ...openApiObject,
      components: {
        ...sofaOpenApiObject.components,
        ...openApiObject.components,
        schemas: {
          ...(sofaOpenApiObject.components?.schemas || {}),
          ...(openApiObject.components?.schemas || {})
        }
      },
      paths: {
        ...sofaOpenApiObject.paths,
        ...openApiObject.paths
      }
    });
  }
  if (env.CORS === '1') app.enableCors();
  const port = await getPort({ port: Number(env.PORT || 3000) });
  if (adapter === Adapter.Fastify) {
    const fastifyApp = app as NestFastifyApplication;
    await fastifyApp.listen(port, '0.0.0.0').catch(logger.error);
  } else {
    const expressApp = app as NestExpressApplication;
    await expressApp.listen(port, '0.0.0.0').catch(logger.error);
  }
  registerSofa(app);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();

declare const module: any;
