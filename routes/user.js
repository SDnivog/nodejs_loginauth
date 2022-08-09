const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

const UserTable = require('../models/user')

const SECRET_KEY = 'Mykey'

// Register User
router.post('/register', async(req,res) => {
    const {username,password,first_name,last_name} = req.body;

    try{
        const user_exists = await UserTable.findOne({username:username});
        if(user_exists){
            return res.status(400).json({msg:"Username Already Exists !"})
        } 
        const user = new UserTable({
            username:username,
            password:password,
            firstName:first_name,
            lastName:last_name
        })
        const data =  await user.save() 
        jwt.sign({id:data.id,username:data.username}, SECRET_KEY, { expiresIn: '30m' }, (err, accessToken) => {
            res.json({
              status:true,
              data:accessToken,
              name:data.username,
              msg:"Successfully registered"
            });
          });
    }catch(err){
        res.json({
            status:false,
            data:null,
            msg:"Register failed"
          });
    }
})


// User Login
router.post('/login', async(req,res) => {
    const {username,password} = req.body;

    try{
        const exists = await UserTable.findOne({username:username,password:password});
        if(!exists){
            return res.status(400).json({msg:"User not found !"});

        }
        jwt.sign({id:exists.id,username:exists.username}, SECRET_KEY, { expiresIn: '10m' }, (err, accessToken) => {
            res.json({
              status:true,
              data:accessToken,
              name:exists.username,
              msg:"Successfully loggedin"  
            });
          });
    }catch(err){
        res.json({
            status:false,
            data:null,
            msg:"Login failed"
          });
    }
})


// Get My Account details
router.get('/my-account', ValidateToken, async(req, res) => {  
    jwt.verify(req.token, SECRET_KEY, (err, Data) => {
      if(err) {
        res.json({
            status:false,
            data:null,
            msg:"User Not authorised !"
          });
      } else {

        res.json({
            status:true,
            name:Data.username,
            msg: 'Successfully authorised'
            
        });
      }
    });

  });

// Fetch all records 
router.get('/all',ValidateToken, async(req,res) => {
    try{
           const all_records = await UserTable.find()
           res.json({
            status:true,
            data:all_records,
            msg:"Successfully fetched all registered users"
           })
    }catch(err){
        res.send('Error ' + err)
    }
})


// Validate Token 
function ValidateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
    res.json({
        status:false,
        msg:"User Not authorised"
    })
    }
  
  }    

module.exports = router

