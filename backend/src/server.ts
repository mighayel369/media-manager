import app from './app.js';
import { connectDB } from './config/db.js';
import logger from './config/logger/index.js';
const PORT = process.env.PORT || 5000;
const startServer = async () => {

    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        })

    }
    catch (error) {
        logger.error('Something went wrong on server', error)
    }
}

startServer()