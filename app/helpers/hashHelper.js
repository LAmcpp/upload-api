const crypto = require('crypto');

module.exports.hashPassword = (password, salt) => {
  try {
    salt = salt ? salt : crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    return {
      salt: salt,
      hash: hash
    };
  } catch(error) {
    throw new Error(`Hashing failed: ${error}`)
  }
};

module.exports.getDatabasePasswordFromHash = (hash)=> {
  return hash.salt + '$' + hash.hash;
};

// module.exports.getPasswordFromHash = (hash) => {
//   return hash.hash;
// };