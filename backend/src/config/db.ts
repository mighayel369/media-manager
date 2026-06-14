import mongoose from 'mongoose';
import logger from './logger/index.js';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(mongoURI);
        logger.info(' MongoDB Atlas connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};