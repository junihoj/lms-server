import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import UserService from './user.service';


@Service()
class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next:NextFunction) {
    try {
      const token = await this.userService.createUser(req.body);
      res.status(200).json({
        success:true,
        message:"An Email message has been sent to your inbox",
        activationToken:token
      });
    } catch (error:any) {
      next(error)
    }
  }

 
}

export default UserController;
