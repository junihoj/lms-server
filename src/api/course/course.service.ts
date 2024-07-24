import Container, { Service } from 'typedi';
import { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import CourseModel, { ICourse } from './course.model';
import { IActivationMailReplacement } from './course.dto';
import jwt, { JwtPayload } from 'jsonwebtoken'
import CourseMailer from './course.mailer';
import ErrorHandler from '@/common/utils/error-handler';
import { sendToken } from '@/common/utils/jwt';
import { Response, Request } from 'express';
import { redis } from '@/config/redis';

import Cloudinay from 'cloudinary';

// interface ICourse {
//   name: string;
//   email: string;
//   password: string;
// }

// interface ICourseDocument extends ICourse, Document { }
Container.set("courseModel", CourseModel)
@Service()
class CourseService {

    private courseModel: Model<ICourse>;

    constructor(@Inject('courseModel') courseModel: Model<ICourse>, public courseMailer: CourseMailer) {
        this.courseModel = courseModel;

    }

    async uploadCourse() {

    }


}

export default CourseService;