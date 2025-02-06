import dotenv from 'dotenv';
import express from 'express'
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import projectRoute from './routes/project.routes.js'
import aiRoute from './routes/ai.routes.js'
import cors from 'cors'

dotenv.config();


const app= express();
connectDB();

app.use(cors());
app.use(cookieParser())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userRoute);
app.use('/project',projectRoute);
app.use('/ai',aiRoute);

export default app;