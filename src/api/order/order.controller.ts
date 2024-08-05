import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import OrderService from './order.service';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '@/common/utils/jwt';
import { IOrder } from './order.model';



@Service()
class OrderController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err)
        }
    }

}

export default OrderController;
