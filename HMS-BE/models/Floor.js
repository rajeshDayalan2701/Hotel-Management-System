const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FloorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
FloorSchema.pre('save', function(next) {
  this.increment();
  return next();
});

//To map FloorSchema with MongoDB collection named floors
const Floor = mongoose.model('floor', FloorSchema);

//Exporting to use this Floor model in other files
module.exports = Floor;

