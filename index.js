require('dotenv').config();
const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors');

//Connect to MongoDB
connectToMongo();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Root Route
app.get("/", (req, res) => {
    res.send("Welcome to NoteNext Backend");
});

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`NoteNext Backend listening at http://localhost:${port}`);
});

module.exports = app;