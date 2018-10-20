
module.exports = {
  getById: (req, res) => {
    console.log(req.params.id);
    res.send("get item by id");
  },
  search: (req, res) => {
    console.log(req.query);
    res.send("search items");
  },
  update: (req, res) => {
    console.log(req.params.id);
    res.send("update item");
  },
  delete: (req, res) => {
    console.log(req.params.id);
    res.send("delete item");
  },
  create: (req, res) => {
    console.log(req.params.id);
    res.send("create item");
  },
  uploadImage: (req, res) => {
    console.log(req.params.id);
    res.send("upload item image");
  },
  removeImage: (req, res) => {
    console.log(req.params.id);
    res.send("remove item image");
  },
};