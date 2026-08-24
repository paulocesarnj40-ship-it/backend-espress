import 'dotenv/config';
import { Router } from 'express';

import {UserController} from './users.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const router = Router();
const userController  = new UserController ;

// Rotas públicas
router.post('/cadastro', (req, res) => userController.createUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));


//Rota protegida por autenticação JWT

router.get("/perfil", authMiddleware, (req, res) => userController.getProfile(req, res))
