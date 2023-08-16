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

  res.status(200).json({ uid: UID }); // Sending UID back to the frontend
});


app.post('/register-card', async (req, res) => {
  
  const { uid, identifier} = req.body;
  console.log(req.body);

  try {
    
    dbConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "register-card" collection and insert the user data
      db.collection('register-card').insertOne({ uid, identifier}, (err) => {
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

app.get('/get-user-data', async (req, res) => {
  const uid = req.query.uid;

  try {
    // Connect to the database using your custom connection setup
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "register-card" collection and find the user data based on UID
      const userData = await db.collection('register-card').findOne({ uid });

      // Return the user data
      res.status(200).json(userData);
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});

app.post('/register-user', async (req, res) => {
  const { uid, identifier, name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    dbConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      const db = dbConnection.get();

      // Access the "users" collection and insert the user data
      db.collection('users').insertOne({
        uid,
        identifier,
        name,
        email,
        password: hashedPassword,
      }, (err) => {
        if (err) {
          console.error('Error inserting user data:', err);
          return res.status(500).send('Error inserting user data');
        }

        res.status(201).send('User created and data stored successfully');
      });
    });
  } catch (error) {
    console.error('An error occurred while creating user and storing data:', error);
    res.status(500).send('Error creating user and storing data');
  }
});


/* LOGIN USER */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  

  try {
    // Connect to the database using your custom connection setup
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "register-card" collection and find the user data based on UID
      const user = await db.collection('users').findOne({ email });
      
      
      if (!user) {
        console.log("Email not found in dbs");
        return res.status(404).send('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        console.log("Invalid password");
        return res.status(401).send('Invalid password');
      }

      // Return the user data
      res.status(200).json(user);
      
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});


module.exports = app;


// dbConnection.connect(); // Await the database connection

//     const db = dbConnection.get();
//     const user = db.collection('users').findOne({ email });

//     if (!user) {
//       console.log("Email not found in dbs");
//       return res.status(404).send('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       console.log("Invalid password");
//       return res.status(401).send('Invalid password');
//     }