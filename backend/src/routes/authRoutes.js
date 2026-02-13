import express from 'express';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';
import { createUserSchema, loginSchema } from '../validators/userValidators.js';
import { signAuthToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role,
      avatarUrl: req.body.avatarUrl || '',
      social: req.body.social || {},
    });

    const token = signAuthToken(user);

    return res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ message: err?.message || 'Unable to create account.' });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or passcode.' });
    }

    let isPasswordValid = await user.comparePassword(req.body.password);

    if (!isPasswordValid && user.password === req.body.password) {
      user.password = req.body.password;
      await user.save();
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or passcode.' });
    }

    const token = signAuthToken(user);
    user.password = undefined;

    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: err?.message || 'Unable to sign in.' });
  }
});

router.post('/logout', protect, (req, res) => {
  return res.status(200).json({ message: 'Signed out successfully.' });
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json(user);
});

export default router;
