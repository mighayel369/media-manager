import authRoute from './auth.routes.js'
import express from 'express'

const userRouter = express.Router()

userRouter.use('/auth', authRoute)

export default userRouter