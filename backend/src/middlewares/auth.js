import User from '../models/User.js';
import { verifyAuthToken } from '../utils/jwt.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      username: user.username,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden.' });
  }
  return next();
};

export const allowSelfOrRoles = (...roles) => (req, res, next) => {
  const isSelf = req.user && req.user.id === req.params.id;
  const hasRole = req.user && roles.includes(req.user.role);

  if (!isSelf && !hasRole) {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  return next();
};
