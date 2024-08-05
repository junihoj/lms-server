import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import Container from "typedi";
import jwt from 'jsonwebtoken'
import { UserRoleEnum } from "@/common/types/enum";

const emailRegex: RegExp = /''/


export interface IUserMethods {
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}
export interface IUser extends Document, IUserMethods {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    }
    role: UserRoleEnum;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;



}


const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (value: string) {
                // emailRegex.test(value)
                return true;
            }
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: {
        courseId: String,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.STUDENT
    }
}, { timestamps: true })

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.signAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN as string)
}
userSchema.methods.signRefreshToken = function (enteredPassword: string) {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN as string || "")
}
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password)
}

const UserModel: Model<IUser> = mongoose.model("User", userSchema)

export default UserModel;