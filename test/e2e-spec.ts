import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { Users } from '../src/entities/users.entity';
import { AuthModule } from '../src/modules/auth/auth.module';
import { getConnection, getRepository } from 'typeorm';
import { UserRegisterDto } from 'src/modules/auth/dto/user-register.dto';
import { UserLoginDto } from 'src/modules/auth/dto/user-login.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let userToken: string;
  let initialUserData: Users;

  // before we run tests we add user to database
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = mod.createNestApplication();
    await app.init();

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
    }

    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Test123!', salt);

    const userRepo = getRepository(Users);
    const testUser = userRepo.create({
      email: 'test@gmail.com',
      password: hashedPassword,
      name: 'Test',
      surname: 'User',
      profilePicture: 'path/defaultPicture',
    });
    await userRepo.save(testUser);
    initialUserData = testUser;
  });

  // after all tests are run we delete all tables in database.  TODO --> change to delete only entred values  OR  Separate environment
  afterAll(async () => {
    /*
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

  it('/me (GET) --> empty 401 on validation error - acces user without authentication', async () => {
    await request(app.getHttpServer())
      .get(`/me`)
      .expect(401);
  });

  it('/register (POST) --> empty 400 on bad request - signup without data', async () => {
    await request(app.getHttpServer())
      .post(`/register`)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('/register (POST) --> 400 on bad request - email in wrong format ', async () => {
    const newUser: UserRegisterDto = {
      email: 'mock',
      password: 'Passw123',
      passwordConfirm: 'Passw123',
      name: 'Mock',
      surname: 'User',
      profilePicture: 'defaultPicture',
    };
    await request(app.getHttpServer())
      .post(`/register`)
      .send(newUser)
      .expect(400);
  });

  it('/register (POST) --> 400 on bad request - too week password', async () => {
    const newUser: UserRegisterDto = {
      email: 'mock.user@gmail.com',
      password: 'mock',
      passwordConfirm: 'mock',
      name: 'Mock',
      surname: 'User',
      profilePicture: 'defaultPicture',
    };
    await request(app.getHttpServer())
      .post(`/register`)
      .send(newUser)
      .expect(400);
  });

  it('/register (POST) --> should register new user', async () => {
    const newUser: UserRegisterDto = {
      email: 'mock.user@gmail.com',
      password: 'Passw123',
      passwordConfirm: 'Passw123',
      name: 'Mock',
      surname: 'User',
      profilePicture: 'defaultPicture',
    };
    await request(app.getHttpServer())
      .post(`/register`)
      .send(newUser)
      .expect(201);
  });

  it('/register (POST) --> 409 on conflict - user already exists', async () => {
    const newUser: UserRegisterDto = {
      email: 'mock.user@gmail.com',
      password: 'Passw123',
      passwordConfirm: 'Passw123',
      name: 'Mock',
      surname: 'User',
      profilePicture: 'defaultPicture',
    };
    await request(app.getHttpServer())
      .post('/register')
      .send(newUser)
      .expect(409);
  });

  it('/login (POST) --> 401 on validation error - wrong credentials', async () => {
    const userCredentals: UserLoginDto = {
      email: 'test',
      password: 'Tesst!',
    };
    await request(app.getHttpServer())
      .post(`/login`)
      .expect('Content-Type', /json/)
      .send(userCredentals)
      .expect(401);
  });

  it('/login (POST) --> 401 on validation error - wrong password', async () => {
    const userCredentals: UserLoginDto = {
      email: 'mock.user@gmail.com',
      password: 'passWord123', //correct password would be: Passw123
    };
    await request(app.getHttpServer())
      .post('/login')
      .send(userCredentals)
      .expect(401);
  });

  it('/login (POST) --> should return accessToken', async () => {
    const userCredentals: UserLoginDto = {
      email: 'mock.user@gmail.com',
      password: 'Passw123',
    };
    await request(app.getHttpServer())
      .post(`/login`)
      .send(userCredentals)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          accessToken: expect.any(String),
        });
        userToken = res.body.accessToken;
      });
  });

  it('/me (GET) --> returns logged in user', async () => {
    await request(app.getHttpServer())
      .get(`/me`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'mock.user@gmail.com',
          password: expect.any(String),
          name: 'Mock',
          surname: 'User',
          profilePicture: 'defaultPicture',
        });
      });
  });

  it('/me/:id (GET) --> returns initial user by id', async () => {
    await request(app.getHttpServer())
      .get(`/me/${initialUserData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'test@gmail.com',
          password: expect.any(String),
          name: 'Test',
          surname: 'User',
          profilePicture: 'path/defaultPicture',
        });
      });
  });

  it('/me/update-password (PATCH) --> updates logged in user', async () => {
    const updateUser: UserRegisterDto = {
      email: 'mock.user_updated@gmail.com',
      password: 'Passw123_updated',
      passwordConfirm: 'Passw123_updated',
      name: 'Mock_updated',
      surname: 'User_updated',
      profilePicture: 'defaultPicture_updated',
    };
    await request(app.getHttpServer())
      .patch('/me/update-password')
      .set({ Authorization: `Bearer ${userToken}` })
      .expect('Content-Type', /json/)
      .send(updateUser)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'mock.user_updated@gmail.com',
          password: expect.any(String),
          name: 'Mock_updated',
          surname: 'User_updated',
          profilePicture: 'defaultPicture_updated',
        });
      });
  });

  it('/login (POST) --> login as updated user - should return new accessToken', async () => {
    const userCredentals: UserLoginDto = {
      email: 'mock.user_updated@gmail.com',
      password: 'Passw123_updated',
    };
    await request(app.getHttpServer())
      .post(`/login`)
      .send(userCredentals)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          accessToken: expect.any(String),
        });
        userToken = res.body.accessToken;
      });
  });

  it('/me (GET) --> returns updated logged in user', async () => {
    await request(app.getHttpServer())
      .get(`/me`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'mock.user_updated@gmail.com',
          password: expect.any(String),
          name: 'Mock_updated',
          surname: 'User_updated',
          profilePicture: 'defaultPicture_updated',
        });
      });
  });

  it('/me (DELETE) --> delete signed in user', async () => {
    await request(app.getHttpServer())
      .delete(`/me`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200);
  });

  it('/me (GET) --> empty 401 on validation error - user deleted', async () => {
    await request(app.getHttpServer())
      .get(`/me`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(401);
  });
});
