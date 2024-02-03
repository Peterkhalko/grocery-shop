const jwt = require('jsonwebtoken');
const jwttoken = (req, res) =>{
  try {
     // secret key we can keep this using environment variables)
     const secretKey = 'question_pro_secrete_key_peterkhalko';
     const payload = {
       username: req.body.username,
       userrole: req.body.userrole,
     };
     // Set the expiration time (optional)
     const expiresIn = '1h'; // 1 hour, you can customize this based on your requirements
     const token = jwt.sign(payload, secretKey, { expiresIn }); 
     return token;
     
  } catch (error) {
    throw new Error("unable to create token")
  }
   
}
module.exports = jwttoken;