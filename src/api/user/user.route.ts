import { Router } from 'express';
import { Container } from 'typedi';
import UserController from './user.controller';

const router = Router();
const userController = Container.get(UserController);

router.post('/', (req, res) => userController.createUser(req, res));


export default router;