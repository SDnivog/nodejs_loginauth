const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect("mongodb://localhost/todotask");


app.get('/home', (req, res) => {
    res.send("Welcome to api page !")
  });
  

app.use(express.json())

const userRouter = require('./routes/user')
app.use('/user/',userRouter)



app.listen(3000, () => {
    console.log('Server Started...')
})