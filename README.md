# ST Trot Race Demo Project

This repo contains source code of ST Trot Race Demo Project.

Please rename .env.sample to .env and add appropriate environment variables value

## Docker configuration

### Create Dockerfile for Nodejs App

__Dockerfile__ defines a list of commands that Docker uses for setting up the Node.js application environment.

### Write Docker Compose configurations

Create a __docker-compose.yml__ file, on the same level as our src directory, which is to say, outside of the src directory.

Below commpands build images specified in docker-compose.yml file

```
docker-compose build
```

Below commands builds the image if they are not located locally and starts the containers. if images are already build, it will run the container directly without build.

```
docker-compose up
```

(Please make sure to run `docker-compose build` command each time making change)

### Mongo DB

URI for Docker mongo DB access:
```
mongodb://mongo:27018/st_trot_race 
(27018 default Specified PORT and st_trot_race is database name in docker-compose.yml file)
```

URI for local mongo DB access:
```
mongodb://localhost:27017/test_st_trot_race 
(27017 default Specified PORT and test_st_trot_race is database name in .env file)
```

NOTE: When running in local make sure your MongoDB service is running in your system. 

## Local configuration

```
npm install
```

<!-- ### Creating dist source

```
npm install
npm build
``` -->

### Running application

```
npm start
```

<!-- ### Running application in Development env

```
npm start:dev
``` -->

### Check linting errors and warnings

Use below command to check linting issues

```
npm lint
```

Use below command to automatically fix the problems

```
npm lint:fix
```

Use below command to automatically fix the problems without saving the changes to the file system

```
npm lint:fixdry
```

## Directory Structure

```
- src
  - config (contains project constants and database configuration)
  - interfaces (defined interfaces)
  - models (contains mongoose schema)
  - services (contains services of application)
  - tests (contains test file)
  app.ts (initial functions)
  server.ts (entry point)
```

## Test Details

### Run test

```
npm test
```

### Get the code coverage report

```
npm test:coverage
```

## Module Dependecies

|             NPM            | Version |
|:--------------------------:|:-------:|
| axios                      | ^0.24.0 |
| http-status-codes          | ^2.1.4  |
| mongoose                   | ^17.0.2 |