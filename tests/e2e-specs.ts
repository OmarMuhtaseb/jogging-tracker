import {INestApplication} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test} from '@nestjs/testing';
import {AuthModule} from '@toptal/libs-auth';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import {AppController} from '../src/controller';
import {JogsModule} from '../src/jogs';
import {UsersModule} from '../src/users';

describe('UsersController', () => {
    let app: INestApplication;
    let adminToken: string;
    const regularUser: {userId?: string, token?: string, jogId?: string} = {};
    const dbName = 'runner-tracker-testing';

    // TODO: Add test for the report

    async function initDB() {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${
            process.env.DB_PASSWORD}@${process.env.DB_HOST}/${dbName}`, {
            authSource: 'admin',
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        const admin = {
            'email': 'admin@gmail.com',
            'name': 'System Admin',
            'password': '$2b$10$UxYlVGRJgASE/Rtt8nUxuu3jabLV5foY1YKDhoihkjhtg2KNDHZGy',
            'role': 'admin',
        };

        await mongoose.connection.useDb(dbName)
            .collection('users').insertOne(admin);
    }

    async function destroyDB() {
        await mongoose.connection.useDb(dbName)
            .collection('users').deleteMany({});
        await mongoose.connection.close();
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                AuthModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get('JWT_SECRET'),
                    }),
                    inject: [ConfigService],
                }),
                UsersModule,
                JogsModule,
            ],
            controllers: [AppController],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        await initDB();

        const response = await request(app.getHttpServer()).post('/users/login')
            .send({email: 'admin@gmail.com', password: 'Abcd@1234'});
        adminToken = response.body.token;
    });

    afterAll(async () => {
        await destroyDB();
        await app.close();
    });

    it(`Post /users`, async () => {
        const response = await request(app.getHttpServer())
            .post('/users')
            .auth(adminToken, {type: 'bearer'})
            .send({
                'email': 'manager@gmail.com',
                'name': 'System Manager',
                'password': 'Abcd@1234',
                'role': 'manager',
            })
            .expect(201);
        expect(response.body.user.id).toBeDefined();
    });

    it(`Post /users/sign-up`, async () => {
        const response = await request(app.getHttpServer())
            .post('/users/sign-up')
            .send({
                'email': 'user@gmail.com',
                'name': 'System User',
                'password': 'Abcd@1234',
            })
            .expect(201);
        expect(response.body.user.id).toBeDefined();
        regularUser.userId = response.body.user.id;
        regularUser.token = response.body.token;
    });

    it(`Post /users/login`, async () => {
        const response = await request(app.getHttpServer())
            .post('/users/login')
            .send({
                'email': 'user@gmail.com',
                'password': 'Abcd@1234',
            })
            .expect(200);
        expect(response.body.user.id).toEqual(regularUser.userId);
    });

    it(`Get /users/me`, async () => {
        const response = await request(app.getHttpServer())
            .get('/users/me')
            .auth(regularUser.token, {type: 'bearer'})
            .expect(200);
        expect(response.body.user.id).toEqual(regularUser.userId);
    });

    it(`Put /users/me`, async () => {
        const updatedName = 'System User - updated';
        const response = await request(app.getHttpServer())
            .put('/users/me')
            .auth(regularUser.token, {type: 'bearer'})
            .send({name: updatedName, email: 'user@gmail.com'})
            .expect(200);
        expect(response.body.user.id).toEqual(regularUser.userId);
        expect(response.body.user.name).toEqual(updatedName);
    });

    it(`Get /users/{id}`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${regularUser.userId}`)
            .auth(adminToken, {type: 'bearer'})
            .expect(200);

        expect(response.body.user.id).toEqual(regularUser.userId);
    });

    it(`Get /users/{id}`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${regularUser.userId}`)
            .auth(adminToken, {type: 'bearer'})
            .expect(200);

        expect(response.body.user.id).toEqual(regularUser.userId);
    });

    it(`GET /users`, async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .auth(adminToken, {type: 'bearer'})
            .expect(200);

        expect(response.body.users.length).toBeGreaterThan(0);
    });

    it(`POST /jogs`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/jogs`)
            .auth(regularUser.token, {type: 'bearer'})
            .send({
                user: regularUser.userId,
                distance: 20,
                time: 400,
                date: '2021-07-20',
                location: 'london',
            })
            .expect(201);

        expect(response.body.jog.id).toBeDefined();
        regularUser.jogId = response.body.jog.id;
    });

    it(`GET /jogs/{id}`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/jogs/${regularUser.jogId}`)
            .auth(regularUser.token, {type: 'bearer'})
            .expect(200);

        expect(response.body.jog.id).toEqual(regularUser.jogId);
    });

    it(`PUT /jogs/{id}`, async () => {
        const updatedLocation = 'paris';
        const response = await request(app.getHttpServer())
            .put(`/jogs/${regularUser.jogId}`)
            .auth(regularUser.token, {type: 'bearer'})
            .send({
                user: regularUser.userId,
                distance: 21,
                time: 400,
                date: '2021-07-20',
                location: updatedLocation,
            })
            .expect(200);

        expect(response.body.jog.id).toEqual(regularUser.jogId);
        expect(response.body.jog.location).toEqual(updatedLocation);
    });

    it(`GET /jogs`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/jogs`)
            .auth(regularUser.token, {type: 'bearer'})
            .expect(200);

        expect(response.body.jogs.length).toBeGreaterThan(0);
    });

    it(`GET /jogs with filters`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/jogs`)
            .query({filter: "(date eq '2021-07-20') AND ((distance gt 20) OR (distance lt 10))"})
            .auth(regularUser.token, {type: 'bearer'})
            .expect(200);

        expect(response.body.jogs.length).toBeGreaterThan(0);
    });

    it(`GET /jogs/report`, async () => {
        await request(app.getHttpServer())
            .put(`/jogs/${regularUser.jogId}`)
            .auth(regularUser.token, {type: 'bearer'})
            .send({
                user: regularUser.userId,
                distance: 21,
                time: 400,
                date: '2021-07-12',
                location: 'paris',
            })
        const response = await request(app.getHttpServer())
            .get(`/jogs/report`)
            .auth(adminToken, {type: 'bearer'})
            .expect(200);

        expect(response.body.data.length).toEqual(2);
    });

    it(`DELETE /jogs/{id}`, async () => {
        const response = await request(app.getHttpServer())
            .delete(`/jogs/${regularUser.jogId}`)
            .auth(regularUser.token, {type: 'bearer'})
            .expect(200);

        expect(response.body.jog.id).toEqual(regularUser.jogId);
    });

    it(`Delete /users/{id}`, async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${regularUser.userId}`)
            .auth(adminToken, {type: 'bearer'})
            .expect(200);

        expect(response.body.user.id).toEqual(regularUser.userId);
    });
});
