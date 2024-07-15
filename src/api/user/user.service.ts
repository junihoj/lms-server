import Container, { Service } from 'typedi';
import { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import UserModel from './user.model';
import { IRegistrationRequest } from './user.dto';
import jwt from 'jsonwebtoken'

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

    constructor(@Inject('userModel') userModel: Model<IUserDocument>) {
        this.userModel = userModel;
    }

    async createUser(registerDto: IRegistrationRequest) {
        const {name, email, password} = registerDto;
        const emailExist =this.userModel.findOne({email})
        if(!emailExist){
          throw Error(`User with ${email} already exist`)
        }
        const activationData= this.createActivationToken(registerDto)
        const activationcode = (await activationData).activationCode;
        
    } 

    async createActivationToken(user: IUser) {
      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const token = jwt.sign(
        {user, activationCode}, 
        process.env.ACTIVATION_SECRET as string,
        {
          expiresIn:'5m'
        }
      )
      return { token, activationCode };
    }
   
}

export default UserService;
