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

### Pagination, filtering, sorting
We can add the following decorators to controller method parameters:

  @PaginationQuery() paginationOptions: PaginationOptions
  - the decorator function accepts as arguments the defaultPage and defaultLimit
  - the decorator function will extract the 'limit' and 'page' query params from the url and populate the **paginationOptions** argument

  @OrderQuery() orderingOptions: OrderingOptions
  - the decorator function accepts as arguments the defaultOrderBy and defaultDirection
  - this will extract the 'orderBy' and 'direction' query params from the url and populate the **orderingOptions** argument

  @FilterQuery('version', 'created', 'user.id') filteringOptions: FilteringOptions,
  - the decorator function accepts as arguments all parameters we want to allow to be used for filtering
  - nested properties are also allowed, ex. if our entity has a 'user' property, we can use 'user.id' to filter by the id of the user
  - the decorator function will extract the **filter** query param from the url and populate the **filteringOptions** argument

  The 'filter' param should be formatted in the following way:

  Simple filter: ?filter=[property],[operator],[value]

  Filter with AND: ?filter=[property],[operator],[value]:and:[property],[operator],[value]

  Filter with OR: ?filter=[property],[operator],[value]:or:[property],[operator],[value]

  Parameters:

  - [property] - the resource property we want to filter on
  
  - [operator] - one of: 'eq', 'not', 'like', 'gt', 'gte', 'lt', 'lte'
  
  - [value] - the value we want to filter by

  If we want to combine several conditions with AND we separate them by **:and:**

  If we want to combine several conditions with OR we separate them by **:or:**

  Only one filter param is allowed per request.


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
