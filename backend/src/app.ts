import express, { Application } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 5000;
const app: Application = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");

export default app
