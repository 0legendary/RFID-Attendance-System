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
      db.collection('register-card').insertOne({ uid, identifier, status: false }, (err) => {
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

/* this endpoint is in POST method, i changed into Get  */
app.post('/submit-code', (req, res) => {

  const UID = 54453455                ;
  //console.log('Sending code:', UID);

  res.status(200).json({ uid: UID }); // Sending UID back to the frontend
});


app.get('/get-user-data', async (req, res) => {
  const uid = req.query.uid;
  console.log(uid);

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
      console.log("The USER is not Registered or created his account");
      if(userAcc){
        if(userAcc.tokens>0){
          await db.collection('users').updateOne({ uid }, { $inc: { tokens: -1 } });
        console.log("User is Existing, one token Didected");
        }else{
          console.log("Insufficiet Balance");
        }
        
      }else{
        const userData = await db.collection('register-card').findOne({ uid });
         res.status(200).json(userData);
      }
      // Return the user data
     
      
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});

// app.get('/get-user-data',  (req, res) => {
//   const uid = req.query.uid;

//   dbConnection.connect(async (err) => {
//     try {
//       // Connect to the database using your custom connection setup
//       const db = dbConnection.get();

//       // Access the "register-card" collection and find the user data based on UID
//       const user = await db.collection('users').findOne({ uid });
//       console.log(user);

//       if (user) {
//         if (user.tokens > 0) {
//           // Decrement tokens and return true
//           await db.collection('users').updateOne({ uid }, { $inc: { tokens: -1 } });
//           // res.status(200).json({ isValid: true });
//           console.log("true");
//           return; 
//         } else {
//           // Return false if tokens are <= 0
//           // res.status(200).json({ isValid: false });
          
//           console.log("false");
//           return; 
//         }
        
//       } 
//         // Access the "register-card" collection and find the user data based on UID
//         const userData = await db.collection('register-card').findOne({ uid });

//         if (userData) {
//           res.status(200).json(userData);
//         } else {
//           res.status(404).json({ error: 'User not found' });
//         }
      
//     } catch (error) {
//       console.error('An error occurred:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   })
// });


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

      res.status(201).send('User created and data stored successfully');
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
      console.log(users);
      // Return the user data
      res.status(200).json(users);
    });
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    // Handle error or show error message to user
    res.status(500).send('Error fetching user data');
  }
});



module.exports = app;
