const Room = require('../models/Room');

const RoomController = {
  getAllRooms () {
    return Room.find({}).sort('-createdAt');
  },

  getRoomById (id) {
    return Room.findOne({
      _id: id
    });
  },

  getRoomsByRoomTypeId (roomTypeId) {
    return Room.find({
      roomTypeId: roomTypeId
    });
  },

  deleteRoomById (id) {
    return Room.findOneAndDelete({
      _id: id
    });
  },

  createNewRoom (newRoom) {
    return newRoom.save();
  },

  getRoomsCount () {
    return Room.count()
  },

  getActiveRoomsCount () {
    return Room.count({
      isActive: true
    })
  },

  getRoomsByFloorId (floorId) {
    return Room.find({
      floorId: floorId
    });
  }
}

module.exports = RoomController;