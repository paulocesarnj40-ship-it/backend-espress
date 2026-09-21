import 'dotenv/config';
import express, { Express } from 'express';
import { router } from './modules/users/users.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app: Express = express();
app.use(express.json());
app.use('/api/user', router);


app.use(errorHandler);
export default app;
