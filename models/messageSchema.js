import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, 
})

const message = mongoose.model('message',messageSchema,'messages')

export default message