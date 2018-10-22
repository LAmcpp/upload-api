const uploadOptions = require('../../config').uploadOptions;

function searchValidation(req, res, next) {
  let
    query = req.query,
    options = {},
    order = [],
    order_by = query['order_by'],
    order_type = query['order_type'];

  if (query.user_id) options.user_id = query.user_id;
  if (query.title) options.title = query.title;

  order_by = order_by ? order_by : "created_at";
  order_type = order_type ? order_type : "desc";
  order.push([order_by, order_type]);
  req.query.options = options;
  req.query.order = order;
  return next();
}

function updateValidation(req, res, next) {
  let updateObject = {};
  if (req.body.title) updateObject.title = req.body.title;
  if (req.body.description) updateObject.description = req.body.description;
  req.body = updateObject;
  return next();
}

function uploadValidation(req, res, next) {
  let files = req.files;
  if (files) {
    let file = files[uploadOptions.fieldName];
    if (!file) return res.status(422).send([{field: "image", message:"Wrong file field name"}]);
    if (!file.data || file.data.length === 0) return res.status(422).send([{field: "image", message:"Missing file data"}]);
    if (file.data.length > uploadOptions.maxFileSize) return res.status(422).send([{field: "image", message:`File ${file.name} too large`}]);
  } else {
    if (!file.data || file.data.length === 0) return res.status(422).send([{field: "image", message:"Missing file"}]);
  }
  return next();
}

module.exports.searchValidation = searchValidation;
module.exports.updateValidation = updateValidation;
module.exports.uploadValidation = uploadValidation;