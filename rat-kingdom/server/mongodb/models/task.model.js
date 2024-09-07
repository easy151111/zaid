import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the Task schema
const taskSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the Task model from the schema
const Task = model('Task', taskSchema);

export default Task;