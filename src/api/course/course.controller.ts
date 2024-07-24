import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import CourseService from './course.service';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '@/common/utils/jwt';
import { ICourse } from './course.model';



@Service()
class CourseController {
    private courseService: CourseService;

    constructor(courseService: CourseService) {
        this.courseService = courseService;
    }

    async uploadCourse(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error: any) {
            next(error)
        }
    }

}

export default CourseController;
