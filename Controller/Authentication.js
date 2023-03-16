const jwt = require("jsonwebtoken");
const {User} = require('../Model/User')
const {generateToken} = require('../Config/Jsonwebtoken');
const bcrypt = require('bcrypt');

 

    const RegisterUser = async (req, res) => {
      console.log('.......', req.body);
     
        const { name, email, password } = req.body;
        // just print it
        console.log(req.body);
        if (!name || !email || !password) {
          
          res.status(400);
          throw new Error("please Enter all the Field");
        }
        const userExist = await User.findOne({ email: email });
      
        if (userExist) {
          res.status(400);
      
          throw new Error("user already exists");
        }
        const user = await User.create({
          email,
          name,
          password,
        });
        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token:  generateToken(user._id)
          });
        } else {
          res.status(400);
          throw new Error("user not found");
        }
      };

const AuthenticateUser = async(req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // res.send(user);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    
    if (password!=user.password) {
      return res.status(401).send('Invalid email or password');
    }
    const token = generateToken(user._id);
    res.send({ token });
     
}


module.exports = {RegisterUser,AuthenticateUser};


