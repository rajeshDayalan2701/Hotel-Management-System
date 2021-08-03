const mongoose = require('mongoose');
const { Schema } = mongoose;

const GuestSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  isVIP: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
GuestSchema.pre('save', function(next) {
  this.increment();
  return next();
});

//To map GuestSchema with MongoDB collection named guests
const Guest = mongoose.model('guest', GuestSchema);

module.exports = Guest;