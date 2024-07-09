import {Server as socketIo} from 'socket.io'
import Message from '../models/messageSchema.js'
import user from '../models/userSchema.js'
const socketHandler = (server)=>{
    const io = new socketIo(server)
    const connectedUsers = new Map()
io.on('connection',(socket)=>{
    socket.on('userConnected',(userId)=>{
        connectedUsers.set(userId,socket)
    })

    socket.on('disConnect',(userId)=>{

        console.log('disconnecting')
        connectedUsers.delete(userId)
    })
    socket.on('privateMessage',async({recipientname,senderId,message})=>{
        const User = await user.findOne({name:recipientname})
        const recipientSocket = connectedUsers.get(User._id.toString())
        const data = new Message({
            sender:senderId,
            message,
            receiver:User._id
        })
        const messageTime =  await data.save()
        const recipient_id = User._id
        const timestamp = messageTime.timestamp
        if(recipientSocket){
            recipientSocket.emit('privateMessage',{senderId,message,recipient_id,timestamp})
        }else{
            console.log('no user')
        }
    })
})
return io
}

export default socketHandler