import express from 'express'
import cors from 'cors'
import path from 'path';
import dbConn from './config/dbConfig.js';
import session from 'express-session'
import flash from 'connect-flash'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import router from './routes/userRoutes.js';
import handleFirebaseMessages from './config/firebaseHandler.js';

const __dirname = path.resolve();

dotenv.config()
const app = express()
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
handleFirebaseMessages()
app.use(flash())
app.use(router)
const port = 3002
dbConn().then(()=> app.listen(port,()=>{
    
}))

