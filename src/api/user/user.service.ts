import Container, { Service } from 'typedi';
import { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import UserModel from './user.model';
import { IRegistrationRequest } from './user.dto';
import jwt from 'jsonwebtoken'
import UserMailer from './user.mailer';
import ErrorHandler from '@/common/utils/error-handler';

interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserDocument extends IUser, Document {}
Container.set("userModel", UserModel)
@Service()
class UserService {
 
  private userModel: Model<IUserDocument>;

    constructor(@Inject('userModel') userModel: Model<IUserDocument>, public userMailer:UserMailer) {
        this.userModel = userModel;
        
    }

    async createUser(registerDto: IRegistrationRequest) {
        try{
          const {name, email, password} = registerDto;
          const emailExist =this.userModel.findOne({email})
          if(!emailExist){
            throw new ErrorHandler(`User with ${email} already exist`, 400)
          }
          const activationData= await this.createActivationToken(registerDto)
          const activationcode = (await activationData).activationCode;
        await  this.userMailer.sendActivationMail(email, {activationCode:activationcode, name:name})
        return (await activationData).token
        }catch(err){
          throw new ErrorHandler("An Error occur while processing your request", 500)
        }
      
    } 

    async createActivationToken(user: IUser) {
      try{
        const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const token = jwt.sign(
        {user, activationCode}, 
        process.env.ACTIVATION_SECRET as string,
        {
          expiresIn:'5m'
        }
      )
      return { token, activationCode };
    
    }catch(err){
      throw new ErrorHandler("An Error Occur While proccessing your request", 500)
    }
  }
   
}

export default UserService;
