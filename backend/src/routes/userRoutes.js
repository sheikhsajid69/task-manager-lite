import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { allowSelfOrRoles, authorizeRoles, protect } from '../middlewares/auth.js';
import { createUserSchema, updateUserSchema } from '../validators/userValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles('admin'), async (req, res) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user',
      avatarUrl: req.body.avatarUrl || '',
      social: req.body.social || {},
    });

    return res.status(201).json(user);
  } catch {
    return res.status(400).json({ message: 'Unable to create user.' });
  }
});

router.get('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'updatedAt', 'username', 'email', 'role'];
    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = {};

    if (req.query.role) {
      const roles = String(req.query.role)
        .split(',')
        .map((item) => item.trim())
        .filter((item) => ['admin', 'user'].includes(item));

      if (roles.length) {
        filter.role = { $in: roles };
      }
    }

    if (req.query.q) {
      const keyword = String(req.query.q).trim();
      if (keyword) {
        filter.$or = [
          { username: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ];
      }
    }

    const [items, totalItems] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch {
    return res.status(500).json({ message: 'Unable to load users.' });
  }
});

router.get('/:id', allowSelfOrRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: 'Unable to load user.' });
  }
});

router.patch('/:id', allowSelfOrRoles('admin'), async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updates = { ...req.body };

    if (req.user.role !== 'admin') {
      delete updates.role;
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(400).json({ message: 'Unable to update user.' });
  }
});

router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: 'Unable to delete user.' });
  }
});

export default router;
