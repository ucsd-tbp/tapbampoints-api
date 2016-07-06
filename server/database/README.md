### Data Access Layer

For the sake of a familiar MVC structure, readability, and ease of development, we use the [Knex query builder](http://knexjs.org) for migrations and data seeding, and the [Bookshelf ORM](http://bookshelfjs.org) for defining models and their relations.

#### Migrations

Knex is included in the project as a part of Bookshelf, but to use the Knex CLI at the command line, install it globally:
```
npm install -g knex
```
The Knex CLI relies on a `knexfile.js` in the current working directory, or alternatively you can pass in its location via `--knexfile`. The Knexfile gets the database connection parameters from the `.env` file in the root directory.

Migration files are in `migrations/`. To run all migrations that haven't been applied yet:
```
cd server/database
knex migrate:latest
```
To rollback a migration:
```
knex migrate:rollback
```
When adding a migration, make sure that `migrate:latest` followed by `migrate:rollback` works.

#### Seeders

[faker.js](https://github.com/marak/Faker.js/) helps with making fake data for database seeding. To run all seeders:
```
knex seed:run
```
Each seed file, located in `seeds/`, is prefixed with a number that's used to determine the order of seeders when `seed:run` is used.

A npm script that resets the database by rolling it back, migrating to the latest migration, and running the seeders is also provided:
```
npm run resetdb
```

More details on the Knex CLI can be found by running:
```
knex --help
```
