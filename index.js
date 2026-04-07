require('dotenv').config();
const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
var cors = require('cors');


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`NoteNext Backend listening at http://localhost:${port}`);
});