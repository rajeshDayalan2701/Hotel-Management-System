const mongoose = require('mongoose');
const { Schema } = mongoose;

const AllocationSchema = new Schema({
  arrivalDate: {
    type: String,
    required: true
  },
  departureDate: {
    type: String,
    required: true
  },
  roomTypeId: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
AllocationSchema.pre('save', function(next) {
  this.increment();
  return next();
});

//To map RoomTypeSchema with MongoDB collection named roomTypes
const Allocation = mongoose.model('allocation', AllocationSchema);

module.exports = Allocation;
