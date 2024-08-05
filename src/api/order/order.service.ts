import Container, { Service } from 'typedi';
import mongoose, { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import OrderModel, { IOrder } from './order.model';
import jwt, { JwtPayload } from 'jsonwebtoken'
import OrderMailer from './order.mailer';
import ErrorHandler from '@/common/utils/error-handler';
import { sendToken } from '@/common/utils/jwt';
import UserModel from '../user/user.model';
import CourseModel from '../course/course.model';

Container.set("orderModel", OrderModel)
@Service()
class OrderService {

    private orderModel: Model<IOrder>;

    constructor(@Inject('orderModel') orderModel: Model<IOrder>, public orderMailer: OrderMailer) {
        this.orderModel = orderModel;

    }


    async createOrder(data: any, userId: string) {
        const { courseId, paymentInfo, } = data;
        const user = await UserModel.findById(userId);
        const courseExist = user?.courses.some((course: any) => course._id.toString() == courseId);
        if (courseExist) throw new ErrorHandler("You have already enroll for this course", 400);
        const course = await CourseModel.findById(courseId);
        if (!course) throw new ErrorHandler("Course not found", 404);

        const courseData: any = {
            courseId: course._id,
            userId: user?._id,
        }
        const order = await this.orderModel.create(data);
    }


}

export default OrderService;