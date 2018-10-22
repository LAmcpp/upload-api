const
  modelsNames = require('../constants'),
  daoHelper = require('../helpers/daoHelper');

let Item;
let User;

function init(models) {
  Item = models[modelsNames.ITEM_TYPE];
  User = models[modelsNames.USER_TYPE];
}

async function getById(id) {
  let result = await Item.find({
    where: {id: id},
    attributes: daoHelper.getItemAttributes(),
    include: [{
      model: User,
      attributes: daoHelper.getUserAttributes()
    }]
  });
  return result ? result.dataValues : result;
}

function search(params, order) {
  let options = {
    where: params,
    order: order,
    attributes: daoHelper.getItemAttributes(),
    include: [{
      model: User,
      attributes: daoHelper.getUserAttributes()
    }]
  };
  return Item.findAll(options);
}

function update(id, options) {
  return Item.update(options, {where: { id: id }} );
}

async function create(values) {
  let newItem = await Item.create(values);
  return newItem ? newItem.dataValues : newItem;
}

async function deleteItem(id) {
  return Item.destroy({where: { id: id }});
}

module.exports.init = init;
module.exports.getById = getById;
module.exports.search = search;
module.exports.update = update;
module.exports.create = create;
module.exports.delete = deleteItem;