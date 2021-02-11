import Joi from 'joi';
import logger from '../utils/logger'
import { handleFailure } from '../utils/helper';

const email = Joi.string().trim().email().required().messages({ 
  'string.base': `email is required`,
  'string.empty': 'email cannot be empty',
  'string.email': 'email cannot be empty',
  'any.required': 'email is required'
});
const username = Joi.string().trim().min(4).max(10).required().messages({
  'string.base': 'username is required',
  'string.empty': 'username cannot be empty',
  'string.min': 'username cannot be empty',
  'any.required': 'username is required'
});
const name = Joi.string().trim().max(30).required().messages({
  'string.base': 'name is required',
  'string.empty': 'name cannot be empty',
  'any.required': 'name is required',
});

const message = 'password must be at least 6 character long, ' +
  'contain alphanumeric and at least one specail characters "@$!%*#?&"';
const password = Joi.string().trim().required()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/).messages({
    'string.base': 'password is required',
    'any.empty': 'password cannot be empty',
    'string.empty': 'password cannot be empty',
    'string.pattern.base': message,
    'any.required': 'password is required',
});

const phone = Joi.string().trim().max(11).required().messages({
  'string.base': 'phone is required',
  'string.empty': 'phone cannot be empty',
  'string.min': 'phone cannot be empty',
  'any.required': 'phone is required'
});

const userId = Joi.string().trim().required().messages({
  'string.base': 'userId is required',
  'string.empty': 'userId cannot be empty',
  'string.min': 'userId cannot be empty',
  'any.required': 'userId is required'
});

const ownerId = Joi.string().trim().required().messages({
  'string.base': 'ownerId is required',
  'string.empty': 'ownerId cannot be empty',
  'string.min': 'ownerId cannot be empty',
  'any.required': 'ownerId is required'
});

const id = Joi.string().trim().required().messages({
  'string.base': 'id is required',
  'string.empty': 'id cannot be empty',
  'string.min': 'id cannot be empty',
  'any.required': 'id is required'
});

const group = Joi.string().trim();

export const signUp = Joi.object().keys({
  email, username, name, password,
});

export const login = Joi.object().keys({
  username, password,
});

export const reset = Joi.object().keys({
  email, password,
});

export const createContact = Joi.object().keys({
  phone, userId, ownerId, group,
});


export const updateContact = Joi.object().keys({
  id, userId
});

// validate necessary fields
export default  async (req, res, next) => {
  const mapRoutes = {
    '/auth/signup': signUp,
    '/auth/login': login,
    '/auth/forgotPassword': reset,
    '/contact': createContact,
    updateContact
  }
  try {
    let validate
    if (req.url === '/contact' && req.method === 'PUT') {
      const { id, userId } = req.body;
      validate = await mapRoutes.updateContact.validate(
        { id, userId }, { abortEarly: false }
      );
    } else {
      validate = await mapRoutes[req.url].validate(
        req.body, { abortEarly: false }
      );
    }
    if (validate.error) return res.status(400).json({
      message:  validate.error.details[0].message, 
    });
    return next();
  } catch(err) {
    return handleFailure(err, res);
  }
}
