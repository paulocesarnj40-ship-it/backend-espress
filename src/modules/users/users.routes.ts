import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { UserController } from './users.controller.js';

export const router = Router();
const userController = new UserController();

// Passando a referência do método diretamente
router.post('/cadastro', userController.createUser);
router.get('/confirmar-email', userController.confirmEmail);
router.post('/login', userController.loginUser);
router.get('/perfil', authMiddleware, (req, res) =>
  userController.getProfile(req as any, res),
);
router.post('/resend-verification', userController.resendVerificationEmail);
