import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import {AppModule} from './module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            validationError: {
                target: true,
                value: true,
            },
        }),
    );

    const mongoAuth = process.env.DB_USER ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@` : '';
    const mongoHost = process.env.DB_HOST;
    const mongoDbName = 'runner-tracker';

    await mongoose.connect(`mongodb+srv://${mongoAuth}${mongoHost}/${mongoDbName}`, {
        authSource: 'admin',
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });

    if (process.env.ENV === 'DEV') {
        mongoose.set('debug', true);
    }

    if (process.env.ENV === 'DEV') {
        const swaggerConfig = new DocumentBuilder().addBearerAuth().setTitle('Runner Tracker').build();
        const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api', app, swaggerDocument);
    }

    await app.listen(process.env.PORT);

    process.on('unhandledRejection', reason => {
        new Logger('app').error(`uncaughtException ${JSON.stringify(reason)}`);
    });
    process.on('uncaughtException', (error: Error) => {
        new Logger('app').error(`uncaughtException ${JSON.stringify(error)}`);
    });
}

bootstrap();
