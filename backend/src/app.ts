import express, { Application } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import logger from './config/logger/index.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './middleware/errorm.handler.middleware.js';
const app: Application = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}))


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");


app.use('/', userRouter)

app.use(errorHandler)

export default app
