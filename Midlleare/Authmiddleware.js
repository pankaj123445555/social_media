const jwt = require("jsonwebtoken");
const {User} = require('../Model/User');
const authenticate = async (req, res, next) => {
   
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      
      try {
         
        token = req.headers.authorization.split(" ")[1];
      //  console.log('token...',token);
        const decoded = jwt.verify(token, 'pankaj');
        console.log(`authentication successfully`);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
      } catch (error) {
        res.status(401);
        throw new Error("NOT AUTHORIZED,TOKEN FAILED");
      }
  
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
    }
  };
  module.exports = {authenticate};