require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const rateLimiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/err');
const router = require('./routes/index');
const { DB_URL } = require('./utils/config');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookies());
app.use(bodyParser.json());
mongoose.connect(DB_URL);
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: ['https://bglvssh.diploma.nomoredomainsrocks.ru', 'http://bglvssh.diploma.nomoredomainsrocks.ru', 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'], credentials: true }));
// app.use(cors());
app.use(rateLimiter);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);
app.listen(PORT);
