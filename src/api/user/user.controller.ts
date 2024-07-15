import { Request, Response } from 'express';
import { Service } from 'typedi';
import UserService from './user.service';


@Service()
class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

 
}

export default UserController;
