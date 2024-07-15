import express from 'express';
import userRoutes from '@/api/user/user.route'
const baseUrl = '/api'
const appRoutes = (app:express.Application)=>{
    app.use(`${baseUrl}/user`, userRoutes);
}

export default appRoutes;