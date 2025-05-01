import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, country } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, country });
  await user.save();
  res.send("User Created");
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).send("Invalid Credentials");
  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token });
});

export default router;
