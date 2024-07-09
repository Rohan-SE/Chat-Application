import user from '../models/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { io } from '../server.js'
import dotenv from 'dotenv'
import message from "../models/messageSchema.js"

dotenv.config()

const signupPage = (req,res)=>{
    res.render('signup',{error:req.flash('error')})
}
const signup = async(req,res)=>{
    try {
        const {name,email,password} = req.body 
        if(!email,!name,!password){
            req.flash('error','Please fill all fields')
            return res.redirect('back')
        }
        const User = await user.findOne({email:email})
        if(User){
            req.flash('error','User already registered')
            return res.redirect('back')
        }
        const hashPass = await bcrypt.hash(password,10)
        const userObj = new user({
            name,
            email,
            password:hashPass
        })
        const token = jwt.sign({name},process.env.TSECRET)
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'Strict'
        })
        const userid = await userObj.save()
        io.on('connect',(socket)=>{
           socket.emit('userConnected',userid._id)
        })
        res.redirect('/users')

    } catch (error) {
        console.log(error)
    }
}
const loginPage = (req,res)=>{
    res.render('login',{error:req.flash('error')})
}
const login = async (req,res)=>{
    try {
        const {email,password} = req.body
        if(!email,!password){
            req.flash('error','Please fill all the fields')
            return res.redirect('back')
        }
        const User = await user.findOne({email:email})
        if(!User){
            req.flash('error','User not found')
            return res.redirect('back')
        }
        bcrypt.compare(password,User.password,(err,result)=>{
            if(result){
                const token = jwt.sign({name:User.name},process.env.TSECRET)

                res.cookie('token',token,{
                    httpOnly: true,
                    secure: true,
                    sameSite:'Strict'
                })

                return res.redirect('/users')
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const logout = (req,res)=>{
    const token = ""
    res.cookie('token',token,{
        httpOnly : true,
        secure : true,
        sameSite:'Strict'
        
    })
    res.redirect('/login')
}

const getUsers = async(req,res)=>{
    const users = await user.find({name:{$ne:req.user.name}})
    const userid = await user.findOne({name:req.user.name}).select('_id')
    res.render('userShow',{users,userid})
}

const chat = async(req,res)=>{
    const id = req.params.id
    const user_one = await user.findOne({_id:id})
    const user_two = await user.findOne({name:req.user.name})
    const Sendermessages = await message.find({$and:[{sender:user_two._id,receiver:user_one._id}]})
    const Recievermessages = await message.find({$and:[{sender:user_one._id,receiver:user_two._id}]})
    const allMessages = [...Recievermessages, ...Sendermessages].sort((a,b)=>a.timestamp - b.timestamp)
    const userid = user_two._id
    const userSenderName = user_two.name
    const userOneName = user_one.name
    res.render('chatPage',{messages:allMessages,userid,userOneName,userSenderName})
}

const userController = {signup,login,signupPage,loginPage,getUsers,chat,logout}

export default userController