import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import CourseService from './course.service';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '@/common/utils/jwt';
import { ICourse } from './course.model';
import { completeUpload, initializeUpload, uploadChunk } from '@/common/lib/video-upload/upload-video-chunk';



@Service()
class CourseController {
    private courseService: CourseService;

    constructor(courseService: CourseService) {
        this.courseService = courseService;
    }

    async uploadCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const course = await this.courseService.uploadCourse(data);
            res.status(201).json({
                success: true,
                course,
            })
        } catch (error: any) {
            next(error)
        }
    }

    async editCoursee(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const courseId = req.params.id;
            const course = await this.courseService.editCourse(courseId, data);
            res.status(201).json({
                success: true,
                course,
            })
        } catch (error: any) {
            next(error)
        }
    }

    async getSingleCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const courseId = req.params.id;
            const course = await this.courseService.getSingleCourse(courseId);
            res.status(201).json({
                success: true,
                course,
            })
        } catch (error: any) {
            next(error)
        }
    }

    async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await this.courseService.getAllCourses();
            res.status(201).json({
                success: true,
                courses,
            })
        } catch (error: any) {
            next(error)
        }
    }

    async getCourseContent(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const userCourses = req.user?.courses;
            const courseId = req.params.id;
            const content = await this.courseService.getCourseContent(userCourses, courseId);
            res.status(201).json({
                success: true,
                content,
            });
        } catch (error: any) {
            next(error)
        }
    }
    async addQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const user = req.user;
            const course = await this.courseService.addQuestion(data, user);
            res.status(201).json({
                success: true,
                course
            });
        } catch (error: any) {
            next(error)
        }
    }

    async answerQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const user = req.user;
            const course = await this.courseService.answerQuestion(data, user);
            res.status(201).json({
                success: true,
                course
            });
        } catch (err) {
            next(err);
        }
    }

    async addReview(req: Request, res: Response, next: NextFunction) {
        try {
            const userCourses = req.user?.courses;
            const courseId = req.params?.id;
            const user = req.user;
            const data = req.body;
            const course = await this.courseService.addReview(data, userCourses, courseId, user);
            res.status(201).json({
                success: true,
                course
            });
        } catch (err) {
            next(err);
        }
    }

    async addReviewReply(req: Request, res: Response, next: NextFunction) {
        try {
            const userCourses = req.user?.courses;
            const courseId = req.params?.id;
            const user = req.user;
            const data = req.body;
            const course = await this.courseService.addReviewReply(data, user);
            res.status(201).json({
                success: true,
                course
            });
        } catch (err) {
            next(err);
        }
    }


    async initializeVideoUpload(req: Request, res: Response, next: NextFunction) {
        return initializeUpload(req, res);
    }
    async uploadChunk(req: Request, res: Response, next: NextFunction) {
        return uploadChunk(req, res);
    }
    async completeUpload(req: Request, res: Response, next: NextFunction) {
        return completeUpload(req, res);
    }

}

export default CourseController;
