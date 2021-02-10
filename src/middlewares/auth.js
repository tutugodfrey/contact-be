import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { signUp, login, reset, createContact } from './validator';

dotenv.config();

export default {
  generateToken: userObj => {
    const secretKey = process.env.SECRET_KEY;
    if (userObj) {
      const token = jwt.sign(userObj, secretKey, {
        expiresIn: '48h',
      });
      if (token) return token;
    }
    return null;
  },
  authUser: (req, res, next) => {
    const { token } = req.headers;
    if (!token)
      return res
        .status(401)
        .json({ message: 'Authentication failed! Please send a token' });
    const data = jwt.decode(token, process.env.SECRECT_KEY);
    if (!data) {
      return res
        .status(401)
        .json({ message: 'Authentication failed! Invalid token' });
    }
    req.body.userId = data.id;
    return next();
  }
}