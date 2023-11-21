const db = require("../../data/dbConfig.js");

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require("../secret");

function get(id) {
    if (id) {
      return db("users as u").where("u.id", id).first().then(function(user) {
        if (user) {
          return user;
        } else {
          return null;
        }
      });
    }
  
    return null;
  }
  
  function findUserByPassword(userName, hashPassword) {
    return db("users as u").where({
      "u.username": userName,
      "u.password": hashPassword
    }).first().then(user => {
      return user;
    });
  }
  
  function findUserByName(userName) {
      return db("users as u").where({
        "u.username": userName
      }).first().then(user => {
        return user;
      });
    }
  
  function createNewUser(user) {
    return db("users")
      .insert(user)
      .then(([id]) => get(id));
  }
  
  function generateToken(user) {
      const payload = {
        subject: user.id,
        username: user.username,
      };
    
      const options = {
        expiresIn: '1d',
      };
    
      return jwt.sign(payload, JWT_SECRET, options);
    }
  
    function validateToken(token){
      return jwt.verify(token, JWT_SECRET);
    }

module.exports = {
    createNewUser,
    findUserByPassword,
    findUserByName,
    generateToken,
    validateToken,
  };