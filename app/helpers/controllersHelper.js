module.exports.logDatabaseError = (err) => {
  let message = "Access database error";
  console.error(message);
  console.error(err.stack || err);
};