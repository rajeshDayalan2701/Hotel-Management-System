const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomTypeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  shortCode: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  baseOccupancy: {
    type: Number,
    required: true
  },
  higherOccupancy: {
    type: Number,
    required: true
  },
  allowExtraBeds: {
    type: Boolean,
    default: false
  },
  noOfExtraBeds: {
    type: Number,
    default: 0
  },
  kidsOccupancy: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  extraPersonPrice: {
    type: Number,
    required: true
  },
  extraBedPrice: {
    type: Number,
    default: 0
  },
  amenities: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
RoomTypeSchema.pre('save', function(next) {
  this.increment();
  return next();
});


//To map RoomTypeSchema with MongoDB collection named roomTypes
const RoomType = mongoose.model('RoomType', RoomTypeSchema);

module.exports = RoomType;