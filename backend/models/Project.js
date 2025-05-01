import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  userId: String,
  name: String,
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
