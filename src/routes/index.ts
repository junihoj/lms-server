import express from 'express';
import userRoutes from '@/api/user/user.route';
import courseRouter from '@/api/course/course.route';
const baseUrl = '/api'
const appRoutes = (app: express.Application) => {
    app.use(`${baseUrl}/user`, userRoutes);
    app.use(`${baseUrl}/course`, courseRouter)
}

export default appRoutes;