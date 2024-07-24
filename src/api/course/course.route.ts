import { Router } from 'express';
import { Container } from 'typedi';
import CourseController from './course.controller';

const courseRouter = Router();
const courseController = Container.get(CourseController);

// router.post('/register-course', (req, res, next) => courseController.createCourse(req, res, next));


export default courseRouter;