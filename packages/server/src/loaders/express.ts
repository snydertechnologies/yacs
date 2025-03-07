import path from 'path';
import routes from '@bigcapital/server/api';
import AgendashController from '@bigcapital/server/api/controllers/Agendash';
import ConvertEmptyStringsToNull from '@bigcapital/server/api/middleware/ConvertEmptyStringsToNull';
import {
  JSONResponseTransformer,
  snakecaseResponseTransformer,
} from '@bigcapital/server/api/middleware/JSONResponseTransformer';
import LoggerMiddleware from '@bigcapital/server/api/middleware/LoggerMiddleware';
import ObjectionErrorHandlerMiddleware from '@bigcapital/server/api/middleware/ObjectionErrorHandlerMiddleware';
import RateLimiterMiddleware from '@bigcapital/server/api/middleware/RateLimiterMiddleware';
import config from '@bigcapital/server/config';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import { type NextFunction, type Request, type Response, json } from 'express';
import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import { Server } from 'socket.io';
import Container from 'typedi';

export default ({ app }) => {
  // Express configuration.
  app.set('port', 3000);

  // Template engine configuration.
  app.set('views', path.join(__dirname, '../resources/views'));
  app.set('view engine', 'pug');

  // Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet());

  // Allow to full error stack traces and internal details
  app.use(errorHandler());

  // Boom response objects.
  app.use(boom());

  app.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Parses both json and urlencoded.
  app.use(json());

  // Middleware for intercepting and transforming json responses.
  app.use(JSONResponseTransformer(snakecaseResponseTransformer));

  app.use('/public', express.static(path.join(process.env.APP_STORAGE_DIR)));

  // Logger middleware.
  app.use(LoggerMiddleware);

  // Converts empty strings to null of request body.
  app.use(ConvertEmptyStringsToNull);

  // Prefix all application routes.
  app.use(config.api.prefix, RateLimiterMiddleware);
  app.use(config.api.prefix, routes());

  // Agendash application load.
  app.use('/agendash', AgendashController.router());

  // Handles objectionjs errors.
  app.use(ObjectionErrorHandlerMiddleware);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.boom.notFound();
  });
  const server = app.listen(app.get('port'), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`
      ################################################
        Server listening on port: ${app.get('port')}
      ################################################
    `);
  });
  const io = new Server(server, { path: '/socket' });

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('SOCKET CONNECTED');

    socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
    });
  });
  // Middleware to pass socket to each request object.
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  });
  Container.set('socket', io);
};
