import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { Users } from '../src/entities/users.entity';
import { AuthModule } from '../src/modules/auth/auth.module';
import { getConnection, getRepository } from 'typeorm';
import { UserRegisterDto } from '../src/modules/auth/dto/user-register.dto';
import { UserLoginDto } from '../src/modules/auth/dto/user-login.dto';
import { LocationDto } from '../src/modules/location/dto/location.dto';
import { Locations } from '../src/entities/locations.entity';
import { GuessDto } from '../src/modules/guess/dto/guess.dto';
import { UpdatePasswordDto } from '../src/modules/user/dto/update-password.dto';
import { GuessModule } from '../src/modules/guess/guess.module';
import { UserModule } from '../src/modules/user/user.module';
import { LocationModule } from '../src/modules/location/location.module';
import { Guesses } from '../src/entities/guesses.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let userToken: string;
  let initialUserData: Users;
  let mockUserData: Users;
  let initialLocatonData: Locations;
  let newLocatonData: Locations;
  let guessLocatonData: Locations;

  const fs = require('fs');
  const profilePictureFilepath = 'uploads/profile-pictures/DefaultAvatar.png';

  const fileData = fs.readFileSync(
    profilePictureFilepath,
    'utf8',
    (err, data) => {
      if (err) throw err;
      console.log(data);
    },
  );
  const fileUpdatedData = fs.readFileSync(
    profilePictureFilepath,
    'utf8',
    (err, data) => {
      if (err) throw err;
      console.log(data);
    },
  );

  // before we run tests we add user to database
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule, AuthModule, LocationModule, GuessModule, UserModule],
    }).compile();

    app = mod.createNestApplication();
    await app.init();

    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Test123!', salt);

    const userRepo = getRepository(Users);
    const testUser = userRepo.create({
      email: 'test@gmail.com',
      password: hashedPassword,
      name: 'Test',
      surname: 'User',
      profilePicture: 'DefaultAvatar.png',
    });
    await userRepo.save(testUser);
    initialUserData = testUser;

    const locationRepo = getRepository(Locations);
    const testLocation = locationRepo.create({
      name: 'Test addres road 23c, New York, USA',
      latitude: 40.786514,
      longitude: -73.962234,
      image: 'Test.jpg',
      user_id: initialUserData.id,
    });
    await locationRepo.save(testLocation);
    initialLocatonData = testLocation;

    const guessRepo = getRepository(Guesses);
    const testUserGuess = guessRepo.create({
      distance: 1,
      user_id: initialUserData.id,
      location_id: initialLocatonData.id,
    });
    await guessRepo.save(testUserGuess);

  });

  // after all tests are run we delete all tables in database.
  afterAll(async () => {
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
      profilePicture: undefined,
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
      profilePicture: undefined,
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
      profilePicture: undefined,
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
      profilePicture: undefined,
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
          profilePicture: 'DefaultAvatar.png',
          resetToken: null,
          resetTokenExpiration: expect.any(String),
        });
        mockUserData = res.body;
      });
  });

  it('/me/:id (GET) --> returns initial user by id', async () => {
    await request(app.getHttpServer())
      .get(`/me/${initialUserData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: initialUserData.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'test@gmail.com',
          password: expect.any(String),
          name: 'Test',
          surname: 'User',
          profilePicture: 'DefaultAvatar.png',
          resetToken: null,
          resetTokenExpiration: expect.any(String),
        });
      });
  });

  it('/me/update-password (PATCH) --> updates logged in user', async () => {
    const updateUser: UpdatePasswordDto = {
      currentPassword: 'Passw123',
      password: 'Passw123_updated',
      passwordConfirm: 'Passw123_updated',
    };
    await request(app.getHttpServer())
      .patch('/me/update-password')
      .set({ Authorization: `Bearer ${userToken}` })
      .expect('Content-Type', /json/)
      .send(updateUser)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: mockUserData.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          email: 'mock.user@gmail.com',
          password: expect.any(String),
          name: 'Mock',
          surname: 'User',
          profilePicture: 'DefaultAvatar.png',
          resetToken: null,
          resetTokenExpiration: expect.any(String),
        });
      });
  });

  it('/login (POST) --> login as updated user - should return new accessToken', async () => {
    const userCredentals: UserLoginDto = {
      email: 'mock.user@gmail.com',
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
          email: 'mock.user@gmail.com',
          password: expect.any(String),
          name: 'Mock',
          surname: 'User',
          profilePicture: 'DefaultAvatar.png',
          resetToken: null,
          resetTokenExpiration: expect.any(String),
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
      profilePicture: undefined,
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
      image: fileData,
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
      image: fileData,
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
      image: fileData,
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Velenje',
          latitude: 46.356637,
          longitude: 15.131544,
          image: expect.any(String),
        });
        initialLocatonData = res.body;
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
            user_id: expect.any(String), 
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'Velenje',
            latitude: '46.356637',
            longitude: '15.131544',
            image: expect.any(String),
          },
          {
            id: expect.any(String),
            user_id: expect.any(String), 
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'Test addres road 23c, New York, USA',
            latitude: '40.786514',
            longitude: '-73.962234',
            image: expect.any(String),
          },
        ]);
      });
  });

  it('/location/id (GET) --> get specific location - gets users new location', async () => {
    await request(app.getHttpServer())
      .get(`/location/${initialLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String), 
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Velenje',
          latitude: '46.356637',
          longitude: '15.131544',
          image: expect.any(String),
        });
      });
  });

  it('/location/id (PATCH) --> update location', async () => {
    const updateLocaton: LocationDto = {
      name: 'Maribor',
      latitude: 46.562667,
      longitude: 15.640516,
      image: fileUpdatedData,
    };
    await request(app.getHttpServer())
      .patch(`/location/${initialLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(updateLocaton)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String), 
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Maribor',
          latitude: 46.562667,
          longitude: 15.640516,
          image: expect.any(String),
        });
      });
  });

  // Add 2 new locations
  it('/location (POST) --> add new location', async () => {
    const dto: LocationDto = {
      name: 'Velenje',
      latitude: 46.356637,
      longitude: 15.131544,
      image: fileData,
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
      image: fileData,
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201)
      .then(res => {
        newLocatonData = res.body;
      });
  });

  it('/location/id (GET) --> get specific location - gets users last location', async () => {
    await request(app.getHttpServer())
      .get(`/location/${newLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Ljubljana',
          latitude: '46.051463',
          longitude: '14.506068',
          image: expect.any(String),
        });
      });
  });

  it('/location/random (GET) --> get random location', async () => {
    await request(app.getHttpServer())
      .get(`/location/random`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          { id: expect.any(String) },
          { id: expect.any(String) },
          { id: expect.any(String) },
        ]);
      });
  });

  it('/location/id (DELETE) --> delete location', async () => {
    await request(app.getHttpServer())
      .delete(`/location/${newLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200);
  });

  it('/location/id (GET) --> empty 404 not found - location deleted', async () => {
    await request(app.getHttpServer())
      .get(`/location/${newLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(404);
  });

  it('/location/id (DELETE) --> empty 404 not found - cant delete location that does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/location/${newLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(404);
  });

  //   ------------ GUESS TESTS ------------ \\

  it('/location (POST) --> add new location', async () => {
    const dto: LocationDto = {
      name: 'Velenje',
      latitude: 46.356637,
      longitude: 15.131544,
      image: fileData,
    };
    await request(app.getHttpServer())
      .post(`/location`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(dto)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          user_id: expect.any(String), 
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: 'Velenje',
          latitude: 46.356637,
          longitude: 15.131544,
          image: expect.any(String),
        });
        guessLocatonData = res.body;
      });
  });
  
  it('/location/guess/id (POST) --> 401 on validation error - no authentication', async () => {
    const newGuess: GuessDto = {
      latitude: 46.231578,
      longitude: 15.264089,
    };
    await request(app.getHttpServer())
      .post(`/location/guess/${guessLocatonData.id}`)
      .send(newGuess)
      .expect(401);
  });
  
  it('/location/guess/id (POST) --> add new guess', async () => {
      const newGuess: GuessDto = {
        latitude: 46.231578,
        longitude: 15.264089,
      };
      await request(app.getHttpServer())
        .post(`/location/guess/${guessLocatonData.id}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send(newGuess)
        .expect(201)
        .then(res => {
          expect(res.body).toEqual({
            distance: 17235,
            id: expect.any(String),
            user_id: expect.any(String), 
            location_id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
  });

  it('/location/guess/id (POST)--> 409 on conflict - guess for this location already exists', async () => {
    const newGuess: GuessDto = {
      latitude: 46.231578,
      longitude: 15.264089,
    };
    await request(app.getHttpServer())
      .post(`/location/guess/${guessLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send(newGuess)
      .expect(409);
  });

  it('/location/guess/id (GET) --> 401 on validation error - no authentication', async () => {
    await request(app.getHttpServer())
      .get(`/location`)
      .expect(401);
  });

  it('/location/guess/id (GET) --> get all guesses in ascending order - gets guesses of selected location', async () => {
    await request(app.getHttpServer())
      .get(`/location/guess/${guessLocatonData.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          {
            id: expect.any(String),
            createdAt: expect.any(String),
            distance: 17235,
            user: {
              id: expect.any(String),
              name: 'Mock',
              profilePicture: 'DefaultAvatar.png',
              surname: 'User',
            },
          },
        ]);
      });
  });

  it('/location/guess/me (GET) --> get my guesses', async () => {
    await request(app.getHttpServer())
      .get(`/location/guesses/me`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          {
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            distance: 17235,
            user_id: expect.any(String),
            location_id: expect.any(String),
          },
        ]);
      });
  });
});
