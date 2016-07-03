#### Overview

This API uses the [Express framework](http://expressjs.com) along with [Bookshelf](http://bookshelfjs.org) as an ORM.

#### Development Setup

Install the latest version of [Node.js](https://nodejs.org/en/).

Copy `.env.example` to a new file, `.env`, and replace the placeholder values with the configuration for your environment. The `.env` file is loaded in `server/database/knexfile.js` so that the Knex CLI can see the environment variables while also loading `.env` as early in the application as possible.

Install application dependencies.
```
npm install
```
To run the application in development:
```
npm run start
```
This uses `nodemon` to restart the server when files are changed.
