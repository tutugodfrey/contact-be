import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv'

dotenv.config();
mongoose.Promise = global.Promise;

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
const uri = process.env.DATABASE_URL ||
	`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}` ||
	`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds215910.mlab.com:15910/contact`;

const env = "dev" || process.env.NODE_ENV;
const connection = mongoose.connect(uri, { useFindAndModify: false, useNewUrlParser: true });

connection
	.then(db => {
		logger.info(
			`Successfully connected to ${uri} MongoDB cluster in ${
			env
			} mode.`,
		);
		return db;
	})
	.catch(err => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(uri);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
	});

export default connection;
