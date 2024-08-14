const { coffe } = require(`../models/index`);
const { Op } = require(`sequelize`);
const path = require(`path`);
const fs = require(`fs`);
const upload = require(`./uploud.images`).single(`image`);

exports.getAll = async (req, res) => {
  let cars = await coffe.findAll();
  return res.json({
    success: true,
    data: cars,
    message: `All coffe have been loaded`,
  });
};

exports.findCoffe = async (req, res) => {
  let keyword = req.params.key;
  let cars = await coffe.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { coffeID: { [Op.substring]: keyword } },
        { price: { [Op.substring]: keyword } },
        { size: { [Op.substring]: keyword } }
      ],
    },
  });
  return res.json({
    success: true,
    data: cars,
    message: `GANOK KOPINE`,
  });
};

exports.addCoffe = (  request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    if (!request.file) {
      return response.json({
        message: `Nothing to Upload`,
      });
    }
    let newEvent = {
      name: request.body.name,
      price: request.body.price,
      size: request.body.size,
      image: request.file.filename,
    };
    coffe.create(newEvent)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New coffe has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateCoffe = async (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    let carID = request.params.id;
    let dataEvent = {
        name: request.body.name,
        price: request.body.price,
        size: request.body.size,
        image: request.file.filename,
    };
    if (request.file) {
      const selectedEvent = await coffe.findOne({
        where: { coffeID: carID },
      });
      const oldImage = selectedEvent.image;
      const pathImage = path.join(__dirname, `../image`, oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataEvent.image = request.file.filename;
    }
    coffe
      .update(dataEvent, { where: { coffeID: carID } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data kopi sudah diupdate`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.deleteCar = async (request, response) => {
  const eventID = request.params.id;
  const event = await coffe.findOne({ where: { coffeID: eventID } });
  const oldImage = event.image;
  const pathImage = path.join(__dirname, `../image`, oldImage);
  if (fs.existsSync(pathImage)) {
    fs.unlink(pathImage, (error) => console.log(error));
  }
  coffe
    .destroy({ where: { coffeID: eventID } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data Kopi di hapus`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
