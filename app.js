const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

dotenv.config({ path: path.resolve(__dirname, 'config', '.env') })

const app = express();

//parsing middleware
app.use(express.json());

//logging middleware
app.use(morgan('dev'));

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

// cookie-parser
app.use(cookie());


// database connection
const dbURI = process.env.DB_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(process.env.PORT, () => { console.log(`server running on port ${process.env.PORT}`) }))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);