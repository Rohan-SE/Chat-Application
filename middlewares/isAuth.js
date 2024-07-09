import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

const authjwt = async (req,res,next)=>{
    const token = req.cookies.token 
if(token){
    jwt.verify(token,process.env.TSECRET,(err,user)=>{
        if(err) return console.error(err)
        req.user = user;
    next()
    })
}else{
    console.log("You are unauthorized")
}
}

export default authjwt