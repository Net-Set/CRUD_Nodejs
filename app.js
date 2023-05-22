const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// Connect to the database
mongoose.connect('mongodb://localhost/users');

// Create the user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create the user model
const User = mongoose.model('User', UserSchema);

// Create the express app
const app = express();

// Configure middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure JWT authentication
app.use(function (req, res, next) {
  const token = req.headers['authorization'] || '';
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// // Configure Swagger
// app.use('/api-docs', swaggerUi.serve(swaggerDocument));

// // Define the routes
// app.get('/users', (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.json(users);
//     }
//   });
// });

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

app.post('/users', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

app.put('/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

app.delete('/users/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('API is listening on port 3000');
});
