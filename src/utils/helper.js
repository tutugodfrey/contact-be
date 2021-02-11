import mongoose from 'mongoose'
import logger from './logger';

export const clearDatabase = () => {
  return new Promise((resolve) => {
    let count = 0
    let max = Object.keys(mongoose.connection.collections).length
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].deleteOne(() => {
        count++
        if (count >= max) {
          resolve()
        }
      })
    }
  })
}

// Return selected fields from result of DB query
export const returnSuccess = (data, fields, res) => {
  if (Array.isArray(data)) {
    const result = data.map(each => {
      const result = {};
      fields.forEach(field => result[field] = each[field]);
      return result;
    });
  
    return res.json(result);
  }

  const result = {};
  fields.forEach(field => result[field] = data[field]);
  return res.json(result);
}

// Handler and log errors
export const handleFailure = (err, res, message, status) => {
  if (err.message.includes('Cast to ObjectId failed for value')) {
    if (status) res.statusCode = status;
    return res.json({ message });
  }
  if (err.message.includes('duplicate')) {
    if (err.message.includes('contact.contacts')) {
      return res.status(409).json({
        message: 'Contact detail already exist',
      });
    }

    if (err.message.includes('contact.users')) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }
  }
  
  logger.error('Error occurred while attempting to serve a request:');
	logger.error(err);
  return res.status(500).json({ message: err.message });
}
