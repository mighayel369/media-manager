import { authMiddleware } from '../middleware/auth.middleware.js'
import authRoute from './auth.routes.js'
import imageRoute from './image.routes.js'
import express from 'express'

const userRouter = express.Router()

userRouter.use('/auth', authRoute)

userRouter.use(authMiddleware());

userRouter.use('/image', imageRoute)

export default userRouter