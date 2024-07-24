import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import UserService from './user.service';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '@/common/utils/jwt';
import { IUser } from './user.model';



@Service()
class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.userService.createUser(req.body);
      res.status(200).json({
        success: true,
        message: "An Email message has been sent to your inbox",
        activationToken: token
      });
    } catch (error: any) {
      next(error)
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.activateUser(req.body);
      if (user) {
        res.status(200).json({
          success: true,
          message: "User Created Successfully",
        });
      }
    } catch (error: any) {
      next(error)
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.loginUser(req.body, res);

    } catch (error: any) {
      next(error)
    }
  }

  async updateAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken as string;
      const { accessToken, refresh_Token, user } = await this.userService.updateAccessToken(refreshToken)
      req.user = user;
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refresh_Token, refreshTokenOptions)
      res.status(200).json({
        success: true,
        accessToken
      })
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req?.user;
      await this.userService.logoutUser(user, res);
      res.status(200).json({
        success: true,
        message: "logged out successfully",
      })
    } catch (err) {
      next(err);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const reqUser = req?.user;

      const userInfo = await this.userService.getUserInfo(reqUser);
      res.status(200).json({
        success: true,
        user: userInfo,
      });
    } catch (err) {
      next(err);
    }
  }

  async socialAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const reqData = req.body;
      const user = await this.userService.socialAuth(reqData)
      sendToken(user as IUser, 200, res);
    } catch (err) {
      next(err)
    }
  }


  async updateUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const reqUser = req?.user;
      const updates = req.body;
      const user = await this.userService.updateUserInfo(reqUser, updates);
      res.json({
        success: true,
        user: user
      })
    } catch (err) {
      next(err)
    }
  }

  async updateUserPassword(req: Request, res: Response, next: NextFunction) {
    const reqData = req.body;
    const userId = req.user?._id;
    const user = await this.userService.updateUserPassword(userId, reqData);

    res.status(200).json({
      success: true,
      user,
    })
  }

  async updateUserAvatar(req: Request, res: Response, next: NextFunction) {
    const reqData = req.body;
    const userId = req.user?._id;
    const user = await this.userService.updateProfileAvatar(userId, reqData);

    res.status(200).json({
      success: true,
      user,
    })
  }
}

export default UserController;
