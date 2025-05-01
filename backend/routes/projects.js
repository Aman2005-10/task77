import express from 'express';
import Project from '../models/Project.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// POST request to create a project
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  const projects = await Project.find({ userId: req.user.id });
  if (projects.length >= 4)
    return res.status(400).send("Max 4 projects allowed");

  const project = new Project({ name, userId: req.user.id });
  await project.save();
  res.json(project);
});

// GET request to fetch all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  const projects = await Project.find({ userId: req.user.id });
  res.json(projects);
});

// PUT request to update a project
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).send('Project not found');
    }
    res.json(updatedProject);
  } catch (err) {
    res.status(500).send('Error updating project');
  }
});

// DELETE request to delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).send('Project not found');
    }
    res.send('Project deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting project');
  }
});

export default router;
