import express from 'express';
import Task from '../models/Task.js';
import mongoose from 'mongoose';
import { protect } from '../middlewares/auth.js';
import createTaskSchema, { updateTaskSchema } from '../validators/taskValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  const { error } = createTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    if (req.user.role !== 'admin' && req.body.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only create tasks for your own account.' });
    }

    const task = await Task.create(req.body);
    return res.status(201).json(task);
  } catch {
    return res.status(400).json({ message: 'Unable to create task.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title'];
    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };

    if (req.user.role === 'admin' && req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
      filter.userId = req.query.userId;
    }

    if (req.query.status) {
      const statuses = String(req.query.status)
        .split(',')
        .map((item) => item.trim())
        .filter((item) => ['pending', 'in-progress', 'completed'].includes(item));

      if (statuses.length) {
        filter.status = { $in: statuses };
      }
    }

    if (req.query.priority) {
      const priorities = String(req.query.priority)
        .split(',')
        .map((item) => item.trim())
        .filter((item) => ['low', 'medium', 'high'].includes(item));

      if (priorities.length) {
        filter.priority = { $in: priorities };
      }
    }

    if (req.query.q) {
      const keyword = String(req.query.q).trim();
      if (keyword) {
        filter.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }
    }

    const [items, totalItems] = await Promise.all([
      Task.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('userId'),
      Task.countDocuments(filter),
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
    return res.status(500).json({ message: 'Unable to load tasks.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('userId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && task.userId?._id?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    return res.status(200).json(task);
  } catch {
    return res.status(500).json({ message: 'Unable to load task.' });
  }
});

router.patch('/:id', async (req, res) => {
  const { error } = updateTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const currentTask = await Task.findById(req.params.id);
    if (!currentTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && currentTask.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('userId');

    return res.status(200).json(task);
  } catch {
    return res.status(400).json({ message: 'Unable to update task.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    await task.deleteOne();
    return res.status(200).json(task);
  } catch {
    return res.status(500).json({ message: 'Unable to delete task.' });
  }
});

export default router;
