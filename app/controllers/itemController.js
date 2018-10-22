const
  path = require('path'),
  fs = require('fs-extra'),
  itemDao = require('../dal/itemDao'),
  userDao = require('../dal/userDao'),
  modelsHelper = require('../helpers/modelsHelper'),
  {uploadOptions, hostName} = require('../config'),
  logDatabaseError = require('../helpers/controllersHelper').logDatabaseError;

async function getById(req, res) {
  try {
    let item = await itemDao.getById(req.params.id);
    if (item) {
      res.send(modelsHelper.itemConvertForResponse(item));
    } else {
      res.status(404).send();
    }
  } catch (err) {
    logDatabaseError(err);
    res.status(404).send();
  }
}

async function search(req, res) {
  try {
    let items = await itemDao.search(req.query.options, req.query.order);
    if (items) {
      res.send(modelsHelper.fromModelToResponse(items, modelsHelper.itemConvertForResponse));
    } else {
      res.status(404).send();
    }
  } catch (err) {
    logDatabaseError(err);
    res.status(404).send();
  }
}

async function update(req, res) {
  try {
    let id = req.params.id;

    let updated = await itemDao.update(id, req.body);
    if (!updated[0]) {
      return res.status(404).send();
    }

    res.send( modelsHelper.itemConvertForResponse(await itemDao.getById(id)) );
  } catch (err) {
    logDatabaseError(err);
    res.status(404).send();
  }
}

async function create(req, res) {
  try {
    let item = await itemDao.create({
      title: req.body.title,
      description: req.body.description,
      user_id: req.body.id
    });

    if (item) {
      item.user = await userDao.getById(item.user_id);
      res.send(modelsHelper.itemConvertForResponse(item));
    } else {
      res.status(422).send([{field: "error", message: "Create error"}]);
    }
  } catch (err) {
    logDatabaseError(err);
    res.status(422).send([{field: "error", message: "Create error"}]);
  }
}

async function deleteItem(req, res) {
  try {
    let deleted = await itemDao.delete(req.params.id);
    if (!deleted) res.status(404).send();

    return removeDir(req, res, () => {
      return res.send();
    });
  } catch (err) {
    logDatabaseError(err);
    res.status(422).send([{field: "error", message: "Error delete"}]);
  }
}

async function uploadImage(req, res){
  console.log(req.params.id);
  let file = req.files[uploadOptions.fieldName];
  let filePath = path.join(uploadOptions.destination, req.params.id, file.name);
  let imagePath = `${hostName}/${uploadOptions.dirName}/${req.params.id}/${file.name}`;
  file.mv(filePath, async (err) => {
    if (err) {
      res.status(422).send({field: 'image', message: err.message});
    }
    req.body.image = imagePath;
    return update(req, res);
  });
}

async function removeImage(req, res) {
  return removeDir(req, res, () => {
    req.body.image = "";
    return update(req, res);
  });
}

async function removeDir(req, res, next) {
  let dirPath = path.join(uploadOptions.destination, req.params.id);
  return fs.remove(dirPath, (err) => {
    if (err) {
      res.status(422).send([{field: "error", message: "Error remove"}]);
    }
    return next();
  });
}

module.exports = {
  getById: getById,
  search: search,
  update: update,
  delete: deleteItem,
  create: create,
  uploadImage: uploadImage,
  removeImage: removeImage
};