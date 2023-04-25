const  jwt = require("jsonwebtoken");

module.exports= function validateToken(token) {
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (data) {
      return data;
    } else {
      return false;
    }
  }catch(e){
    return false;
  }
}
