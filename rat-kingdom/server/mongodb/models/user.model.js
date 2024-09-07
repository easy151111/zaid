import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the IUser schema
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  RATS: {
    type: Number,
    required: true,
  },
  frens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  uplineBonus: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Create the User model from the schema
const User = model('User', userSchema);

export default User;