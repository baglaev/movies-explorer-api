require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/error-handler');
const { validateUserAuthentication, validateUserInfo } = require('./middlewares/validateUser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3003, DB_URL = 'mongodb://127.0.0.1:27017/diploma' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 100,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// const corsOptions = {
//   origin: 'http://localhost:3001',
//   credentials: true,
// };

app.use(limiter);
// app.options('*', cors(corsOptions));
app.use(cors({ origin: ['https://bglvssh.diploma.nomoredomainsrocks.ru/', 'http://bglvssh.diploma.nomoredomainsrocks.ru/', 'http://localhost:3001'], credentials: true }));
// app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post('/signin', validateUserAuthentication, login);
app.post('/signup', validateUserInfo, createUser);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.use('*', () => { throw new NotFoundError('Ресурс не найден.'); });

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
