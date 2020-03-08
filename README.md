## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with Auth.
This repository builds upon the [Nest Typescript Starter](https://github.com/nestjs/typescript-starter) by adding the neccessary modules and configuration for registration and authentication of users using JWT and refresh tokens.

## Features

Includes:

### Endpoints:
- /register
- /login
- /logout
- /refresh-token
- /change-password

### Migrations

- npm scripts to run migrations

In the folder 'migrations' you will find:
- initial migration (will create the database tables)
- initial seed (will seed the database with example data: new user with username 'admin' and password 'admin' and role 'admin')

You can run these by executing: 
```bash
npm run run-pending-migrations
```

Both of these files could be safely deleted if you don't need to use them.

A new migration could then be generated using:

```bash
npm run generate-migration
```

## Installation

```bash
$ npm install
```

## Prerequisites

1. Make sure the following env variables are present: DATABASE_URL, JWT_SECRET

2. Generate and run an initial migration
```bash
$ npm run generate-migration
```
This will create the migration under 'migrations/dist'

Now you can run it:
```
$ npm run run-pending-migrations
```
This will create the tables 'user' and 'refresh_token' in the database

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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
