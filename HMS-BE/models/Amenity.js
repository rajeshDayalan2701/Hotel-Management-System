const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AmenitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  shortCode: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
AmenitySchema.pre('save', function(next) {
  this.increment();
  return next();
});

//To map AmenitySchema with MongoDB collection named amenities
const Amenity = mongoose.model('amenities', AmenitySchema);

//Exporting to use this Amenity model in other files
module.exports = Amenity;