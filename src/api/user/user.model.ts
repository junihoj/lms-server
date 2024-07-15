import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import Container from "typedi";

const emailRegex:RegExp = /''/

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    }
    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    comparePassword:(password:string)=>Promise<boolean>;

}


const userSchema:Schema<IUser> =new  Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:function(value:string){
                // emailRegex.test(value)
                return true;
            }
        },
        unique:true,
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        select:false
    },
    avatar:{
        public_id:String,
        url:String,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    courses:{
        courseId:String,
    }
},{timestamps:true})

userSchema.pre<IUser>("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword:string):Promise<boolean>{
    return  bcrypt.compare(enteredPassword, this.password)
}

const UserModel:Model<IUser> = mongoose.model("User", userSchema)

export default UserModel;