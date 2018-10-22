function getUserAttributes(isValidation) {
  return isValidation ? ['id', 'phone', 'name', 'email', 'password'] : ['id', 'phone', 'name', 'email'];
}

function getItemAttributes() {
  return ['id', 'created_at', 'title', 'description', 'image', 'user_id'];
}

module.exports.getUserAttributes = getUserAttributes;
module.exports.getItemAttributes = getItemAttributes;