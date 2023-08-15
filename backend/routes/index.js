const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Route to render your React component
app.get('/', function(req, res, next) {
  res.render('index.jsx', { title: 'UID Generator' });
});

app.post('/submit-code', (req, res) => {
  const UID = req.body.uid;
  console.log('Received code:', UID);
  
  // Simulate that the UID doesn't exist
  const uidExists = false;

  if (uidExists) {
    res.send("Code exists in the database.");
  } else {
    res.status(404).send("UID not found"); // Sending a status code indicating UID not found
  }
});

module.exports = app;
