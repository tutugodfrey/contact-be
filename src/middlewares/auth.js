import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../entities/user';

dotenv.config();
export default {
  // generate a token signed with user data and secret key
  generateToken: userObj => {
    const secretKey = process.env.SECRET_KEY;
    if (userObj) {
      const token = jwt.sign(userObj, secretKey, {
        expiresIn: '24h',
      });
      if (token) return token;
    }
    return;
  },
  // authenticate a user
  // verify that user data is valid
  authUser: async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res
      .status(401)
      .json({ message: 'Authentication failed! Please send a token' });

    const data = jwt.decode(token, process.env.SECRECT_KEY);
    if (!data) return res
      .status(401)
      .json({ message: 'Authentication failed! Invalid token' });
    try {
      const user = await User.findById(data.id);
      if (!user)
        return res.status(401).json({
          message: 'Authentication failed! User does not exist',
        });  

      req.body.userId = user.id;
      return next();
    } catch(err) {
      logger.error('Error occurred while attempting to serve a request:');
      logger.error(err);
      return res.status(500).json({ message: err.message }); 
    }
  }
}
