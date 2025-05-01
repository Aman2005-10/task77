import express from 'express';

import auth from '../middlewares/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { projectId, title, description, status } = req.body;
  const task = new Task({ projectId, title, description, status });
  await task.save();
  res.json(task);
});

router.get('/:projectId', auth, async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });

  res.json(tasks);
});

router.put('/:id', auth, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

export default router;
