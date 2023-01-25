# GUESS LOCATION

<img alt="image" src="https://brotherants.com/skillupmentor/images/02-project-header.png" width="600px" /> 

**Short description** :

A Full-stack (backend | frontend -> https://github.com/tomicilija/Geotagger-Frontend) application that allows users to upload an image and mark the exact location on the Google map where the image was taken.
Registered users then try to guess where the image was taken by placing a pin on the Google map. As a result, the app returns how accurately he chose the location (error distance). 

https://trello.com/b/e6qYu9mz/02-ilija-tomic

**Technologies we used:** 
Html, Css, MUI (ex. MaterialUI), Figma, JavaScript, Typescript, Node, NestJS, Express, React, Docker, Amazon AWS, Amazon S3, Git, GitHub, Jest, PostgreSQL, TypeORM, JWT, Postman, Swagger, Trello

<img alt="image" src="https://brotherants.com/skillupmentor/images/image5.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image7.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/mui-icon.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image12.png" width="25px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image17.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image4.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image3.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image19.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image1.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image11.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image18.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image16.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/aws-s3-icon.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image2.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image10.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/jest-icon.jpeg" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image8.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image15.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image14.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image9.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/swagger.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image13.png" width="30px" />


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


**Implemented functionality** :
- JWT token authentication
- Implement forgot password functionality (send reset token to user email)
- File upload on Amazon S3
- JSON server responses
- Docker
-  Docker: For local environment configuration (database, env vars, ...)
-  Docker: Dockerfile for building a docker image from the application code
- Deploy backend Docker Container on AWS
- Deploy frontend on AWS S3
- Tests (backend only) - EndToEnd test
-  Tests: All your endpoints must have at least one test, multiple edge case tests are a bonus
-  Tests: All tests must pass
-  Tests: Separate environment for testing
- Implement Logging (logger)
- Implement Cors (Cross-origin resource sharing)
- Reactive form validation
- Migrations for database
- Figma pixel perfect design
- Swagger for API documentation
- Use .ENV for database credentials (security).



**Endpoints:**
/auth/login
/auth/register

/location

```Return list of latest locations (you can add pagination)```

/location/random 

```Return random location```

/location 

```Create location```

/location/guess/:id 

```Guess the location lat/lon```

**Disclaimer :**

*This assignment is protected with SkillUp Mentor copyright. The Candidate may upload the assignment on his closed profile on GitHub (or other platform), but any other reproduction and distribution of the assignment itself or the assignment&#39;s solutions without written permission of SkillUp Mentor is prohibited.*
