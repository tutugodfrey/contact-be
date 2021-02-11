import User from '../entities/user';
import Contact from '../entities/contact';
import logger from '../utils/logger';

// Return selected fields from result of DB query
const returnSuccess = (data, fields, res) => {
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

/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods 
 */
export default {
  // get all contacts for a user
  all: async (req, res) => {
    try {
      const contacts = await Contact.find();
      const fields =
        [ 'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt' ];
      res.statusCode = 200;
      if (contacts && contacts[0].phone) return returnSuccess(contacts, fields, res);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    } catch(err) {
      logger.error('Error occurred while attempting to serve a request:');
	    logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  },
  
  // get a single contact
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Contact.findById(id);
      const fields =
        [ 'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt' ];
      res.statusCode = 200;
      if (contact && contact.phone) return returnSuccess(contact, fields, res);
    } catch(err) {
      if (err.message.includes('Cast to ObjectId failed for value'))
        return res.status(404).json({
          message: 'Contact detail not found',
        });

      logger.error('Error occurred while attempting to serve a request:');
	    logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  },
  
  // create a single contact
  create: async (req, res) => {
    const { phone, group, ownerId, userId } = req.body;
    try {
      const user = await User.findById(ownerId);
      if (!user)
        return res.status(400).json({
          message: 'Contact not saved! User does not exist',
        });
    
      const contact = await Contact.create({ userId, phone, ownerId, group });
      if (contact && contact.phone) {
        const fields = 
          [ 'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt' ];
        res.statusCode = 201;
        if (contact && contact.phone) return returnSuccess(contact, fields, res);
      }

      return res.status(500).json({
        message: 'An error occurred, please try again later',
      });
    } catch(err) {
      if (err.message.includes('Cast to ObjectId failed for value'))
        return res.status(400).json({
          message: 'Please provide a valid user id for ownerId',
        });

      if (err.message.includes('duplicate'))
        return res.status(409).json({
          message: 'Contact detail already exist',
        });

        logger.error('Error occurred while attempting to serve a request:');
		    logger.error(err);
        return res.status(500).json({
          message: err.message,
        });
    }
  },

  // update a single contact
  update: async (req, res) => {
    const { userId, ownerId, phone, group } = req.body;
    const { id } = req.params;
    try {
      const contact = await Contact.findOneAndUpdate(
        {id, userId }, { phone, group, ownerId },
        {
        new: true,
        omitUndefined: true,
        });
      if (contact) {
        const fields = [ 'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt' ];
        res.statusCode = 200;
        if (contact && contact.phone) return returnSuccess(contact, fields, res);
    }
      return res.status(500).json({ message: 'An error occurred! Please try again later' });
    } catch(err) {
      logger.error('Error occurred while attempting to serve a request:');
	    logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  },
  
  // remove a single contact
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Contact.deleteOne({ _id: id });
      if (result && result.deletedCount === 1) {
        return res.status(200).json({
          message: 'Contact successfully deleted',
        });
      }
      return res.status(404).json({
        message: 'Contact not found! No action taken',
      });
    } catch(err) {
      logger.error('Error occurred while attempting to serve a request:');
	    logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}
