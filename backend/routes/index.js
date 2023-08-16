const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const dbConnection = require('../config/connection')
const bcrypt = require('bcrypt');

// Route to render your React component
app.get('/', function(req, res, next) {
  res.render('index.jsx', { title: 'UID Generator' });
});

app.post('/submit-code', (req, res) => {
  const UID = req.body.uid;
  console.log('Received code:', UID);
  
  // Simulate that the UID doesn't exist
  const uidExists = true;

  if (uidExists) {
    res.send("Code exists in the database.");
  } else {
    res.status(404).send("UID not found"); // Sending a status code indicating UID not found
  }
});


app.post('/register-card', async (req, res) => {
  
  const { uid, name, email, password } = req.body;
  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Connect to the database using your custom connection setup
    dbConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "register-card" collection and insert the user data
      db.collection('register-card').insertOne({ uid, name, email,password: hashedPassword}, (err) => {
        if (err) {
          console.error('Error inserting user data:', err);
          return res.status(500).send('Error inserting user data');
        }

        // Return success response
        res.status(201).send('User created successfully');
      });
    });
  } catch (error) {
    console.error('An error occurred while creating user:', error);
    // Handle error or show error message to user
    res.status(500).send('Error creating user');
  }
});

module.exports = app;
