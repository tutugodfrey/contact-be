import User from '../entities/user';
import Contact from '../entities/contact';
import { returnSuccess, handleFailure } from '../utils/helper'

/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods 
 */
export default {
  // get all contacts for a user
  all: async (req, res) => {
    try {
      const contacts = await Contact.find();
      const fields = [
        'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt'
      ];
      res.statusCode = 200;
      if (contacts && contacts[0].phone)
        return returnSuccess(contacts, fields, res);

      return res.status(500).json({
        message: 'An error occurred, please try again later'
      });
    } catch(err) {
      return handleFailure(err, res);
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
      return handleFailure(err, res, 'Contact detail not found', 404);
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
      const message = 'Please provide a valid user id for ownerId';
      return handleFailure(err, res, message, 400);
    }
  },

  // update a single contact
  update: async (req, res) => {
    const { id, userId, ownerId, phone, group } = req.body;
    try {
      const contact = await Contact.findOneAndUpdate(
        { _id: id, userId }, { phone, group, ownerId },
        {
        new: true,
        omitUndefined: true,
        });
      
      if (!contact) 
        return res.status(404).json({
          message: 'Contact not found! No action taken'
        });

      const fields = [ 
        'id', 'userId', 'ownerId', 'phone', 'group', 'createdAt', 'updatedAt'
      ];
      res.statusCode = 200;
      return returnSuccess(contact, fields, res);
      
    } catch(err) {
      const message = 'Contact not found! No action taken';
      return handleFailure(err, res, message, 404)
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
      return handleFailure(err, res);
    }
  }
}
