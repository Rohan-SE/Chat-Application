import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path';
import socketHandler from './config/socketConfig-backend.js';
import dbConn from './config/dbConfig.js';
import session from 'express-session'
import flash from 'connect-flash'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import router from './routes/userRoutes.js';

const __dirname = path.resolve();

dotenv.config()
const app = express()
const server = http.createServer(app)
export const ioFunction = ()=>{
    const io = socketHandler(server)
    return io
}
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(cors())
app.use(flash())
app.use(router)

const port = 3002
dbConn().then(()=> server.listen(port,()=>{
    
}))