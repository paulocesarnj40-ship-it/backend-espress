import 'dotenv/config';
import express, { Express } from 'express';
import { router } from './modules/users/users.routes.js';

const app: Express = express();

app.use(express.json());
app.use('/api/user', router);

export default app;
