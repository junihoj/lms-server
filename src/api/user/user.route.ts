import { Router } from 'express';
import { Container } from 'typedi';
import UserController from './user.controller';

const router = Router();
const userController = Container.get(UserController);

router.post('/register', (req, res, next) => userController.createUser(req, res, next));


export default router;