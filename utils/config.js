require('dotenv').config();

const DB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/diploma';
const JWT_SECRET = process.env.PROD === 'production' ? process.env.JWT_SECRET : 'dev-secret';

module.exports = {
  DB_URL,
  JWT_SECRET,
};
