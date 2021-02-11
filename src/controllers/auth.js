import User from '../entities/user';
import logger from '../utils/logger';
import authMiddleware from '../middlewares/auth'

/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const login = async (req, res) => {
	const { username, password } = req.body
	const message = 'Auth failed! Please check your username and password';
	try {
		const result = await User.find({
			username,
		});

		if (!result.length) {
			return res.status(401).json({ message });
		}
		const pwVerify = await result[0].verifyPassword(password);
		if (pwVerify ) {
			const { id, name, username, email } = result[0];
			const user = { id, name, username, email };
			const token = authMiddleware.generateToken(user);
			if (token) {
				user.token = token;
				return res.status(200).json(user);
			}
			return res.status(401).json({ message });
		}
		return res.status(401).json({ message });
	} catch(err) {
		logger.error('Error occurred while attempting to serve a request:');
		logger.error(err);
		return res.status(500).json({ message: err.message });
	}
};
/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Create a new user and return some authentication token 
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const signup = async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		const result = await User.create({ name, username, email, password });
		if (result) {
			const { id, name, username, email } = result;
			const user = { id, name, username, email }
			const token = authMiddleware.generateToken(user);
			if (token) {
				user.token = token;
				return res.status(201).json(user);
			}
		}
		return res.status(500).json({ 
			message: 'An error occurred! please try again later', 
		});
	} catch(err) {
		if (err.message.includes('duplicate')) {
			return res.status(409).json({ message: 'User already exists' });
		}
		logger.error('Error occurred while attempting to serve a request:');
		logger.error(err);
		return res.status(400).json({ message: err.message });
	}
	
};
/**
 * Implement a way to recover user accounts
 * This implementation assume the last step for
 * password recovery
 * Given email and password
 * if the email verified, the password is set
 * A token is generated and returned along with user data
 */
export const forgotPassword = async (req, res) => {
	const { email, password } = req.body;
	try {
		const result = await User.findOneAndUpdate(
			{ email },
			{ password },
			{ new: true, omitUndefined: true },
		);
		if (result && result.username) {
			const { id, name, username, email, createdAt, updatedAt } = result;
			const user = { id, name, username, email };
			const token = authMiddleware.generateToken(user);
			user.token = token;
			user.createdAt = createdAt;
			user.updatedAt = updatedAt;
			user.message = 'Successfully reset password';
			return res.status(200).json(user);
		}
		return res.status(500).json({
			message: 'Unable to reset password! Please try again later'
		});
	} catch(err) {
		logger.error('Error occurred while attempting to serve a request:');
		logger.error(err);
		return res.status(500).json({ message: err.message });
	}
};

export default {
	login,
	signup,
	forgotPassword
}
