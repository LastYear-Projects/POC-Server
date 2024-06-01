import mongoose from 'mongoose';
import {BLUE, RESET_COLOR} from '../constants/index'
const connectDB =  () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        mongoose.connection.once('open', () => {
            console.log(BLUE+'[server]' + RESET_COLOR+ ' Connected to MongoDB');
        });
    } catch (error) {
        console.log('[server] ' +error.message);
        process.exit(-1);
    }
}

export default connectDB