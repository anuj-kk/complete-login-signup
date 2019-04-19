require('rootpath')();
const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const auth = require('middlewares/auth');
const errorHandler = require('middlewares/error-handler');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(morgan('dev'));
//app.use(auth());

mongoose.connect(config.connectionString, { useNewUrlParser: true, useCreateIndex: true });

app.use('/users', require('./user/controller'));
// app.use('/doc', require('./doc/controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, () => {
    console.log('Server listening on port ' + port);
});