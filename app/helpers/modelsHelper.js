function userConvertForResponse(user) {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email
  };
}

function itemConvertForResponse(item) {
  return {
    id: item.id,
    created_at: dateToSeconds(item.created_at),
    title: item.title,
    description: item.description,
    image: item.image,
    user_id: item.user_id,
    user: item.user
  };
}

function dateToSeconds(date) {
  return parseInt(new Date(date).getTime() / 1000);
}

function fromModelToResponse(models, converter) {
  let converted;
  if (models.length) {
    converted = [];
    models.forEach( (elem) => {
      converted.push(converter(elem));
    });
  } else {
    converted = converter(models);
  }
  return converted;
}

module.exports.fromModelToResponse = fromModelToResponse;
module.exports.userConvertForResponse = userConvertForResponse;
module.exports.itemConvertForResponse = itemConvertForResponse;
module.exports.dateToSeconds = dateToSeconds;