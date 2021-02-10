import Contact from '../controllers/contact';
import contactMiddleware from '../middlewares/contact';
import authMiddleware from '../middlewares/auth'
import validate from '../middlewares/validator';
/**
 * 
 * 
 */
module.exports = app => {
  app.route('/contact').get(
    authMiddleware.authUser,
    Contact.all
  );
  app.route('/contact/:id').get(
    authMiddleware.authUser,
    Contact.get
  );
  app.route('/contact').post(
    authMiddleware.authUser,
    validate,
    Contact.create,
  );
  app.route('/contact').put(
    authMiddleware.authUser,
    validate,
    Contact.update,
  );
  app.route('/contact/:id').delete(
    authMiddleware.authUser,
    Contact.remove
  );
    /**
     * Create the remaining routes
     * get,
     * create,
     * delete,
     * update,
     * remove
     */
};
