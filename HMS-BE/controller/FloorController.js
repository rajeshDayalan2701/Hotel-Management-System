const Floor = require('../models/Floor');

const FloorController = {
  getAllFloors () {
    return Floor.find({}).sort('-createdAt');
  },

  getFloorById (id) {
    return Floor.findOne({
      _id: id
    });
  },

  deleteFloorById (id) {
    return Floor.findOneAndDelete({
      _id: id
    });
  },

  createNewFloor (newFloor) {
    return newFloor.save();
  },

  getFloorsCount () {
    return Floor.count()
  },

  getActiveFloorsCount () {
    return Floor.count({
      isActive: true
    })
  }
}

module.exports = FloorController;