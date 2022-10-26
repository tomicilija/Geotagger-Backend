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
import { LocationDto } from 'src/modules/location/dto/location.dto';
import { Locations } from 'src/entities/locations.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let userToken: string;
  let initialUserData: Users;
  let locatonData: Locations;

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

  //   ------------ USER TESTS ------------ \\

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

  //   ------------ LOCATION TESTS ------------ \\

  it('/register (POST) --> register new user to add location', async () => {
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

  it('/login (POST) --> log in  new user to add location', async () => {
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

  it('/location (POST)) --> 401 on validation error - no authentication', async () => {
    const dto: LocationDto = {
      name: 'Velenje',
      latitude: 46.356637,
      longitude: 15.131544,
      image: 'path/locationImage',
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .send(dto)
      .expect(401);
  });

  it('/location (GET) --> 401 on validation error - no authentication', async () => {
    await request(app.getHttpServer())
      .get(`/location`)
      .expect(401);
  });

  it('/location/id (PATCH) --> 401 on validation error - no authentication', async () => {
    const updateLocaton: LocationDto = {
      name: 'Maribor',
      latitude: 46.562667,
      longitude: 15.640516,
      image: 'path/locationImage',
    };
    await request(app.getHttpServer())
      .patch(`/location/id`)
      .send(updateLocaton)
      .expect(401);
  });

  it('/location/id (DELETE) --> 401 on validation error - no authentication', async () => {
    await request(app.getHttpServer())
      .delete(`/location/id`)
      .expect(401);
  });

  it('/location (POST) --> add new location', async () => {
    const dto: LocationDto = {
      name: 'Velenje',
      latitude: 46.356637,
      longitude: 15.131544,
      image: 'path/locationImage',
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String), // eslint-disable-line @typescript-eslint/camelcase
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Velenje',
          latitude: 46.356637,
          longitude: 15.131544,
          image: 'path/locationImage',
        });
        locatonData = res.body;
      });
  });

  it('/location (GET) --> get all locations - gets users new location', async () => {
    await request(app.getHttpServer())
      .get(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          {
            id: expect.any(String),
            user_id: expect.any(String), // eslint-disable-line @typescript-eslint/camelcase
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'Velenje',
            latitude: '46.356637',
            longitude: '15.131544',
            image: 'path/locationImage',
          },
        ]);
      });
  });

  it('/location/id (GET) --> get specific location - gets users new location', async () => {
    await request(app.getHttpServer())
      .get(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
            id: expect.any(String),
            user_id: expect.any(String), // eslint-disable-line @typescript-eslint/camelcase
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'Velenje',
            latitude: '46.356637',
            longitude: '15.131544',
            image: 'path/locationImage',
          });
      });
  });

  it('/location/id (PATCH) --> update location', async () => {
    const updateLocaton: LocationDto = {
      name: 'Maribor',
      latitude: 46.562667,
      longitude: 15.640516,
      image: 'path/locationImageMaribor',
    };
    await request(app.getHttpServer())
      .patch(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(updateLocaton)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String), // eslint-disable-line @typescript-eslint/camelcase
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Maribor',
          latitude: 46.562667,
          longitude: 15.640516,
          image: 'path/locationImageMaribor',
        });
      });
  });

  // Add 2 new locations
  it('/location (POST) --> add new location', async () => {
    const dto: LocationDto = {
      name: 'Velenje',
      latitude: 46.356637,
      longitude: 15.131544,
      image: 'path/locationImage',
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201);
  });

  it('/location (POST) --> add new location', async () => {
    const dto: LocationDto = {
      name: 'Ljubljana',
      latitude: 46.051463,
      longitude: 14.506068,
      image: 'path/locationImage',
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201)
      .then(res => {
        locatonData = res.body;
      });
  });

  it('/location/id (GET) --> get specific location - gets users last location', async () => {
    await request(app.getHttpServer())
      .get(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
            id: expect.any(String),
            user_id: expect.any(String), // eslint-disable-line @typescript-eslint/camelcase
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'Ljubljana',
            latitude: '46.051463',
            longitude: '14.506068',
            image: 'path/locationImage',
          });
      });
  });

  it('/location/random (GET) --> get random location', async () => {
    await request(app.getHttpServer())
      .get(`/location/random`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body.name).toMatch(/^Ljubljana|Velenje|Maribor$/) // regex to match any of these values
        expect(res.body.latitude).toMatch(/^46.051463|46.356637|46.562667$/) // regex to match any of these values
        expect(res.body.longitude).toMatch(/^14.506068|15.131544|15.640516$/); // regex to match any of these values
      });
  });

  it('/location/id (DELETE) --> delete location', async () => {
    await request(app.getHttpServer())
      .delete(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200);
  });

  it('/location/id (GET) --> empty 404 not found - location deleted', async () => {
    await request(app.getHttpServer())
      .get(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(404);
  });

  it('/location/id (DELETE) --> empty 404 not found - cant delete location that does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/location/${locatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(404);
  });
});
