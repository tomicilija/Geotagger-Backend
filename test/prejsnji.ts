

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { Users } from '../src/entities/users.entity';
import { AuthRepository } from '../src/modules/auth/auth.repository';
import { AuthModule } from '../src/modules/auth/auth.module';
import { getConnection, getRepository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmModuleOptions from '../src/config/orm.config';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: AuthRepository;
  let mod: TestingModule;
  let jwt: string;

  // before we run tests we add user to database
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = mod.createNestApplication();
    await app.init();
/*
    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Test123!', salt);

    const userRepo = getRepository(Users);
    const testUser = userRepo.create({
      email: 'test@gmail.com',
      password: hashedPassword,
      name: 'Test',
      surname: 'User',
      profilePicture: 'DafaultPicture',
    });
    await userRepo.save(testUser);*/
  });

  // after all tests are run we delete all tables in database.  TODO --> change to delete only entred values  OR  Separate environment
  afterAll(async () => {/*
    try {
      const entities = [];
      getConnection().entityMetadatas.forEach(x =>
        entities.push({ name: x.name, tableName: x.tableName }),
      );
      for (const entity of entities) {
        const repository = getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" cascade;`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }*/
    await app.close();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('It works!');
  });
  /*
  it('/auth/register (POST) should register new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'ilija.tomic@gmail.com',
        password: 'Passw123',
        passwordConfirm: 'Passw123',
        name: 'Ilija',
        surname: 'Tomic',
        profilePicture: 'defaultPicture',
      })
      .expect(201);
  });

  it('/auth/register (POST) should return error because user already exists', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'ilija.tomic@gmail.com',
        password: 'Passw123',
        passwordConfirm: 'Passw123',
        name: 'Ilija',
        surname: 'Tomic',
        profilePicture: 'defaultPicture',
      })
      .expect(409);
  });

  it('/auth/login (POST) should return access_token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'newUser', password: 'test123' })
      .expect(201)
      .then(res => {
        userToken = res.body.access_token;
      });
  });

  it('/auth/login (POST) should return error because of wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'newUser', password: 'test111' })
      .expect(400);
  });

  // it('Example how to include jwt in request', () => {
  //   return request(app.getHttpServer())
  //     .post('/something')
  //     .set('authorization', `Bearer ${userToken}`)
  //     .expect(200)
  //     .expect({ someData: true });
  // });

  afterAll(async () => {
    await userRepository.query('DELETE FROM "user"');
  });*/
});
