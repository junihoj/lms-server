import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import CourseController from './course.controller';
import { multerUpload } from '@/common/middleware/multer'

const courseRouter = Router();
const courseController = Container.get(CourseController);

// router.post('/register-course', (req, res, next) => courseController.createCourse(req, res, next));
courseRouter.post(`/upload/initialize`, multerUpload.none(), (req: Request, res: Response, next: NextFunction) => {
    courseController.initializeVideoUpload(req, res, next).catch(next);
})
courseRouter.post(`/upload`, multerUpload.single('chunk'), (req: Request, res: Response, next: NextFunction) => {
    courseController.uploadChunk(req, res, next).catch(next);
})
courseRouter.post(`/upload/complete`, multerUpload.single('chunk'), (req: Request, res: Response, next: NextFunction) => {
    courseController.completeUpload(req, res, next).catch(next);
})

export default courseRouter;