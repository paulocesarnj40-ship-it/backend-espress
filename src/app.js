import 'dotenv/config';
import express from "express";
import { router } from './modules/users/users.routes.js';

const app = express()

app.use(express.json());
app.use('/api/user', router)


export default app