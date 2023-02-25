require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const limiter = require('./utils/rate-limiter');
const { requestLogger, errorLogger } = require('./utils/loggers');
const cors = require('./middlewares/cors');
const handleErrors = require('./middlewares/handle-errors');
const { mongoDbLocalDefault } = require('./utils/dev-config');

const app = express();
const { PORT = 3000, DB_ADDRESS = mongoDbLocalDefault } = process.env;

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(cors);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://${DB_ADDRESS}/bitfilmsdb`);

app.listen(PORT);
