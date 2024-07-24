import { Router } from 'express';
import { Container } from 'typedi';
import UserController from './user.controller';

const router = Router();
const userController = Container.get(UserController);

router.post('/register-user', (req, res, next) => userController.createUser(req, res, next));
router.post('/activate-user', (req, res, next) => userController.activateUser(req, res, next));
router.post('/login', (req, res, next) => userController.loginUser(req, res, next));


export default router;