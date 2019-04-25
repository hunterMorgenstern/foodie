import express from 'express';
import parser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { join } from 'path';

import router from '../../routes/index';

const middleWare = [
  helmet(),
  parser.json(),
  parser.urlencoded({ extended: true }),
  cors({
    allowedHeaders: 'Content-Type, authorization',
    methods: ['GET, POST, PUT, DELETE', 'OPTIONS'],
  }),
];

class App {
  constructor() {
    this.express = express();
    this.mountMiddleWare();
    this.mountRoutes();
  }

  mountMiddleWare() {
    this.express.use(...middleWare);
    this.express.use(
      express.static(join(__dirname, '../../../../../client/public'))
    );
  }

  mountRoutes() {
    this.express.use('/', router);
  }
}

export default new App();
