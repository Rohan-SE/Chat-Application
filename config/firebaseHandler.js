import app from './firebaseConfig.js'
import user from '../models/userSchema.js'
import {getDatabase,ref,onValue} from '@firebase/database'
import Message from '../models/messageSchema.js'

const handleFirebaseMessages = ()=>{
    const db = getDatabase(app)
    const msgRef = ref(db,'messages')

    const messageSaveMongodb = async(data)=>{
        if (data && typeof data === 'object') {
            for (const key in data) {
                const { recipientname, sender, message,messageNumber } = data[key];
                const User = await user.findOne({ name: recipientname });
                const existingMessage = await Message.findOne({messageNumber:messageNumber})
                if(existingMessage){
                    console.log('duplicate')
                }else{
                    const newdata = new Message({
                        sender:sender,
                        message,
                        receiver:User._id,
                        messageNumber,
                    })
                    await newdata.save()
                }
            }
      
    }}

    onValue(msgRef,(snapshot)=>{
        const data = snapshot.val()
        messageSaveMongodb(data)
    })
}

export default handleFirebaseMessages