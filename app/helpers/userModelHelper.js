module.exports.fromModelToResponse = (users) => {
  let data;
  if (users.length) {
    data = [];
    users.forEach( (user) => {
      data.push(
        {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email
        }
      );
    });
  } else {
    data = {
      id: users.id,
      phone: users.phone,
      name: users.name,
      email: users.email
    };
  }
  return data;
};
