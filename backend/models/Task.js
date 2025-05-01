import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  description: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
