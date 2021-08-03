const RoomType = require('../models/RoomType');

const RoomTypeController = {
  getAllRoomTypes () {
    return RoomType.find({}).sort('-createdAt');
  },

  getRoomTypeById (id) {
    return RoomType.findOne({
      _id: id
    });
  },

  deleteRoomTypeById (id) {
    return RoomType.findOneAndDelete({
      _id: id
    });
  },

  createNewRoomType (newRoomType) {
    return newRoomType.save();
  },

  getRoomTypesCount () {
    return RoomType.count()
  },

  getRoomTypesWithExtraBeds () {
    return RoomType.count({
      allowExtraBeds: true
    });
  },

  getRoomTypesByAmenityId (amenityId) {
    return RoomType.find({
      amenities: amenityId
    });
  }
}

module.exports = RoomTypeController;