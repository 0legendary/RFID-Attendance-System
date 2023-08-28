const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const dbConnection = require('../config/connection')
const bcrypt = require('bcrypt');

// Route to render your React component
app.post('/check-admin-auth', (req, res) => {
  const { email, password } = req.body;

  // Replace with your actual admin credentials
  const adminEmail = 'alen@gmail.com';
  const adminPassword = '123';

  if (email === adminEmail && password === adminPassword) {
    res.status(200).send('Admin authenticated');
  } else {
    res.status(401).send('Unauthorized');
  }
});




app.get('/', function (req, res, next) {
  res.render('index.jsx', { title: 'UID Generator' });
});



app.post('/register-card', async (req, res) => {
  const { uid, identifier } = req.body;

  try {
    dbConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).json({ message: 'Database connection error' });
      }

      const db = dbConnection.get();

      db.collection('register-card').insertOne({ uid, identifier, status: false })

        console.log("User created");
        res.status(200).json({ message: 'User created successfully' });
      });
    
  } catch (error) {
    console.error('An error occurred while creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


/* this endpoint is in POST method, i changed into Get  */
app.post('/submit-code', (req, res) => {

  const UID = 955345695;
  //console.log('Sending code:', UID);

  res.status(200).json({ uid: UID }); // Sending UID back to the frontend
});


app.get('/get-user-data', async (req, res) => {
  const uid = req.query.uid;
  //console.log(uid);

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
      const userAcc = await db.collection('users').findOne({ uid });

      if (userAcc) {
        if (userAcc.tokens > 0) {
          await db.collection('users').updateOne({ uid }, { $inc: { tokens: -1 } });
          console.log("User is Existing, one token Diducted");
          res.status(200).json({ message: "One token Deducted", data: userAcc });
        } else {
          console.log("Insufficiet Balance");
          res.status(200).json({ message: "Insufficient Balance", data: userAcc });

        }

      } else {
        const userData = await db.collection('register-card').findOne({ uid });
        if (userData) {
          console.log("User Registered his card but not created his Account");
          res.status(200).json({ message: "User Registered but not created Account", data: userData });
          //console.log(userData);
        } else {
          console.log("A new card is detected");
          res.status(200).json({ message: "A new card is detected", data: null });
        }

      }
      // Return the user data


    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).json({ message: "Error fetching user data", data: null });
  }
});


app.post('/register-user', async (req, res) => {
  const { uid, identifier, name, email, password, tokens } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      const db = dbConnection.get();

      // Access the "users" collection and insert the user data
      await db.collection('users').insertOne({
        uid,
        identifier,
        name,
        email,
        password: hashedPassword,
        tokens: tokens || 0,
      });

      // Update status in the "register-card" collection
      await db.collection('register-card').updateOne({ uid }, { $set: { status: true } });

      res.status(200).send('User created and data stored successfully');
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

      // Access the "register-card" collection and find the user data based on email
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
      
      // Call another endpoint by passing user.uid
      fetch(`http://localhost:4000/get-tokens-balance/${user.uid}`)
        .then(response => response.json())
        .then(data => {
          // Return the user data along with tokens
          res.status(200).json({ ...user, tokens: data.tokens });
        })
        .catch(error => {
          console.error('An error occurred while fetching tokens:', error);
          res.status(500).send('Error fetching tokens');
        });
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});


app.get('/get-tokens-balance/:uid', async (req, res) => {
  const uid = req.params.uid;
  
  try {
    // Connect to the database
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).json({ message: 'Database connection error' });
      }

      // Get the database instance
      const db = dbConnection.get();
      const user = await db.collection('users').findOne({ uid });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send JSON response with tokens
      res.status(200).json({ tokens: user.tokens });
    });
  } catch (error) {
    console.error('An error occurred while fetching tokens balance:', error);
    res.status(500).json({ message: 'Error fetching tokens balance' });
  }
});



app.post('/purchase-tokens', async (req, res) => {
  const { uid, balance } = req.body;

  try {
    // Connect to the database using your custom connection setup
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Update the user's tokens in the database
      await db.collection('users').updateOne({ uid }, { $inc: { tokens: balance } });


      const updatedUser = await db.collection('users').findOne({ uid }); // Retrieve the user with the updated token balance
      //console.log(updatedUser);
      const updatedTokens = updatedUser.tokens;


      res.status(200).json({ message: 'Tokens purchased successfully', updatedTokens });
    });
  } catch (error) {
    console.error('An error occurred while processing payment:', error);
    // Handle error or show error message to user
    res.status(500).send('Error processing payment');
  }
});


/* To show users in admin pannel */
// Remove the existing "/get-students" route and keep the "/get-user-data" route
app.get('/get-user-data-for-admin', async (req, res) => {
  try {
    // Connect to the database using your custom connection setup
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "users" collection and fetch all user data
      const users = await db.collection('users').find().toArray();

      // Return the user data
      res.status(200).json(users);
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});


app.get('/get-scanned-card-data', async (req, res) => {
  try {
    // Connect to the database using your custom connection setup
    dbConnection.connect(async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return res.status(500).send('Database connection error');
      }

      // Get the database instance
      const db = dbConnection.get();

      // Access the "users" collection and fetch all user data
      const users = await db.collection('register-card').find().toArray();
      //console.log(users);
      // Return the user data
      res.status(200).json(users);
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});


app.delete('/delete-user/:uid', async (req, res) => {
  const uid = req.params.uid;
  const db = dbConnection.get();
  try {
    // Delete user from 'users' collection
    await db.collection('users').deleteOne({ uid });

    // Update status in 'register-card' collection
    await db.collection('register-card').updateOne({ uid }, { $set: { status: false } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('An error occurred while deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

app.delete('/delete-rfid-card/:uid', async (req, res) => {
  const uid = req.params.uid;
  const db = dbConnection.get();
  try {
    // Delete card from 'register-card' collection
    await db.collection('register-card').deleteOne({ uid });

    //Delete user from 'users' collection
    await db.collection('users').deleteOne({ uid });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('An error occurred while deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});




module.exports = app;
