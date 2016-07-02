#### Overview

This API uses the [Express framework](http://expressjs.com) along with [Bookshelf](http://bookshelfjs.org) as an ORM.

#### Development Setup

Install the latest version of [Node.js](https://nodejs.org/en/).

Both the `start` and `serve` scripts register `dotenv` so that the environment variables in `.env` can be loaded as quickly as possible. Copy `.env.example` to a new file, `.env`, and replace the placeholder values with the configuration for your environment.

Install application dependencies.
```
npm install
```
To run the application in development:
```
npm run start
```
This uses `nodemon` to restart the server when files are changed.
