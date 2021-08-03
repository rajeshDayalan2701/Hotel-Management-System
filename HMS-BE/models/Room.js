const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomNumber: {
    type: String,
    required: true
  },
  floorId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  roomTypeId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
RoomSchema.pre('save', function(next) {
  this.increment();
  return next();
});


//To map RoomTypeSchema with MongoDB collection named roomTypes
const Room = mongoose.model('room', RoomSchema);

module.exports = Room;