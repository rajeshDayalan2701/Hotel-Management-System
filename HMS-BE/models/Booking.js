const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  adults: {
    type: Number,
    required: true
  },
  kids: {
    type: Number,
    required: true
  },
  arrivalDate: {
    type: String,
    required: true
  },
  departureDate: {
    type: String,
    required: true
  },
  confirmationId: {
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
  },
  bookingDate: {
    type: String,
    required: true
  },
  guestId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  bookingStatus: {
    type: String,
    required: true
  },
  allocationId: {
    type: String,
    required: true
  },
  dailyRates: {
    type: Map,
    of: String,
    required: true
  }
}, {
  timestamps: true
});

//TO increment the version number of the document during updates
BookingSchema.pre('save', function(next) {
  this.increment();
  return next();
});

//To map RoomTypeSchema with MongoDB collection named roomTypes
const Booking = mongoose.model('booking', BookingSchema);

module.exports = Booking;