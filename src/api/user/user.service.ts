import Container, { Service } from 'typedi';
import { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import UserModel, { IUser } from './user.model';
import { IActivateUserRequest, IActivationData, ILoginDto, IRegistrationRequest } from './user.dto';
import jwt, { JwtPayload } from 'jsonwebtoken'
import UserMailer from './user.mailer';
import ErrorHandler from '@/common/utils/error-handler';
import { sendToken } from '@/common/utils/jwt';
import { Response, Request } from 'express';
import { redis } from '@/config/redis';
import { getUserById } from './user.helpers';
import Cloudinay from 'cloudinary';

// interface IUser {
//   name: string;
//   email: string;
//   password: string;
// }

// interface IUserDocument extends IUser, Document { }
Container.set("userModel", UserModel)
@Service()
class UserService {

  private userModel: Model<IUser>;

  constructor(@Inject('userModel') userModel: Model<IUser>, public userMailer: UserMailer) {
    this.userModel = userModel;

  }

  async createUser(registerDto: IRegistrationRequest) {
    try {
      const { name, email, password } = registerDto;
      const emailExist = this.userModel.findOne({ email })
      if (!emailExist) {
        throw new ErrorHandler(`User with ${email} already exist`, 400)
      }
      const activationData = await this.createActivationToken(registerDto)
      const activationcode = (await activationData).activationCode;
      await this.userMailer.sendActivationMail(email, { activationCode: activationcode, name: name })
      return (await activationData).token
    } catch (err) {
      throw new ErrorHandler("An Error occur while processing your request", 500)
    }

  }

  async activateUser(activateUserDto: IActivateUserRequest) {
    try {
      const { activationCode, activationToken } = activateUserDto;
      const activationData: IActivationData = jwt.verify(activationToken, process.env.ACTIVATION_SECRET as string, {}) as IActivationData;
      if (activationData.activationCode != activationCode) {
        throw new ErrorHandler("Invalid activation Code", 400)
      }
      const userData = activationData.user;
      const userExist = await this.userModel.findOne({ email: userData?.email });
      if (userExist) {
        throw new ErrorHandler("User already Exist", 400)
      }

      const newUser = await this.userModel.create(userData);
      return newUser;
    } catch (err) {
      throw new ErrorHandler("An Error occur while processing your request", 500)
    }

  }

  async loginUser(loginDto: ILoginDto, res: Response) {
    try {
      const { email, password } = loginDto;

      if (!email || !password) {
        throw new ErrorHandler("Invalid Credentials provided!", 400)
      }
      const user = await this.userModel.findOne({ email }).select("+passowrd");
      if (!user) {
        throw new ErrorHandler("Invalid Email or password", 400)
      }

      const isPasswordValid = user.comparePassword(password);
      if (!isPasswordValid) {
        throw new ErrorHandler("Invalid Email or password", 400);
      }

      sendToken(user, 200, res)

    } catch (err) {

    }
  }

  async logoutUser(user: any, res: Response) {
    try {
      if (!user) {
        throw new ErrorHandler("Invalid session", 400)
      }
      res.cookie("accessToken", "", { maxAge: 0 })
      res.cookie("refreshToken", "", { maxAge: 0 })

      redis.del([user._id])

    } catch (err) {
      throw new ErrorHandler("An Error Occur while trying to Logout Error", 500)
    }
  }

  async createActivationToken(user: IRegistrationRequest) {
    try {
      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as string,
        {
          expiresIn: '5m'
        }
      )
      return { token, activationCode };

    } catch (err) {
      throw new ErrorHandler("An Error Occur While proccessing your request", 500)
    }
  }
  async updateAccessToken(refreshToken: string) {
    try {

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as JwtPayload
      if (!decoded) {
        throw new ErrorHandler("Invalid Token Provided", 400)
      }

      const session = await redis.get(decoded._id as string);
      if (!session) {
        throw new ErrorHandler("Invalid Token Provided", 400)
      }
      const user = JSON.parse(session as string);
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string)
      const refresh_Token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string)
      return { accessToken, refresh_Token, user }

    } catch (err) {
      throw new ErrorHandler(`Invalid Token`, 403)
    }
  }

  async getUserInfo(reqUser: any) {
    if (!reqUser) {
      throw new ErrorHandler("Please Login to access this Resource", 403)
    }
    const userId = reqUser._id
    const user = this.userModel.findById(userId);
    if (user) {
      return user;
    } else {
      throw new ErrorHandler("Could not Retrieve user information", 500);
    }
  }

  async socialAuth(data: any) {
    try {
      const { email, name, avatar } = data;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        const newUser = await this.userModel.create({ email, avatar, name });
        return newUser as IUser;
      }
      return user as IUser;
    } catch (err) {
      throw new ErrorHandler("An Error occur while creating social auth profile", 500)
    }
  }

  async updateUserInfo(reqUser: any, update: any) {
    try {
      const { name, email } = update;
      if (!reqUser) {
        throw new ErrorHandler("Please login to perform this action", 403)
      }
      const userId = reqUser._id;
      const user = await this.userModel.findById(userId);
      if (email && user) {
        const emailExist = await this.userModel.findOne({ email });
        if (emailExist) {
          throw new ErrorHandler("email already exist", 400)
        }
        user.email = email;
      }

      await user?.save();
      await redis.set(user?._id as string, JSON.stringify(user))

      return user;
    } catch (err) {
      throw new ErrorHandler("An Error Occur while updating profile information", 500)
    }
  }

  async updateUserPassword(userId: string, reqData: any) {
    try {
      const { oldPassword, newPassword } = reqData;
      if (!oldPassword || newPassword) {
        throw new ErrorHandler('Please enter old and new password', 400)
      }
      const user = await this.userModel.findById(userId).select("+password");
      if (!user?.password) {
        throw new ErrorHandler("Can not update Password", 400)
      }
      if (!user) throw new ErrorHandler("Invalid session please login and try again", 400);

      const isPasswordValid = await user?.comparePassword(oldPassword);
      if (!isPasswordValid) {
        throw new ErrorHandler("Invalid Password", 400)
      }
      user.password = newPassword;
      await user.save();
      await redis.set(user._id as string, JSON.stringify(user));
      return user;
    } catch (err) {
      throw new ErrorHandler("An Error occur while processing your request", 500)
    }


  }

  async updateProfileAvatar(userId: string, data: any) {
    try {
      const { avatar } = data;
      if (!userId) throw new ErrorHandler("Invalid Session, Please Login and try again", 403);
      const user = await this.userModel.findById(userId);
      if (!user) throw new ErrorHandler("User not found", 404)
      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await Cloudinay.v2.uploader.destroy(user?.avatar?.public_id)
        }

        const avatarUpload = await Cloudinay.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: avatarUpload.public_id,
          url: avatarUpload.secure_url
        }

        await user.save();
        await redis.set(user._id as string, JSON.stringify(user));
        return user;
      } else {
        throw new ErrorHandler("Invalid parameter provided", 400)
      }
    } catch (err) {
      throw new ErrorHandler("An Error Occur while updating pix", 500)
    }
  }


}

export default UserService;
