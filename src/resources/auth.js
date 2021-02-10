import Auth from '../controllers/auth';
import validate from '../middlewares/validator';

module.exports = app => {
	app.route('/auth/login').post(validate, Auth.login,);
	app.route('/auth/signup').post(validate, Auth.signup);

	/*** BONUS POINTS ***/
	app.route('/auth/forgotPassword')
	  .post(validate, Auth.forgotPassword);
};
