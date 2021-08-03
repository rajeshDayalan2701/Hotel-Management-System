const moment = require('moment');
const Booking = require('../models/Booking');

const BookingController = {
  getAllBookings () {
    return Booking.find({}).sort('-createdAt');
  },

  getPastBookings (startDate, endDate) {
    return Booking.find({ 
      $and: [
        { 
          departureDate: {
            $gte: startDate
          }
        },
        { 
          departureDate: {
            $lte: endDate
          }
        }
      ]
    });
  },

  getFutureBookings (startDate, endDate) {
    return Booking.find({ 
      $and: [
        { 
          arrivalDate: {
            $gte: startDate
          }
        },
        { 
          arrivalDate: {
            $lte: endDate
          }
        }
      ]
    });
  },

  getAllActiveBookings () {
    return Booking.find({
      departureDate: {
        $gte: moment().format('YYYY-MM-DD')
      },
      arrivalDate: {
        $lte: moment().format('YYYY-MM-DD')
      }
    }).sort('-createdAt');
  },

  getBookingsByAllocationsIds (allocationIds) {
    return Booking.find({
      allocationId: {
        $in: allocationIds
      }
    })
  },

  getBookingById (id) {
    return Booking.findOne({
      _id: id
    });
  },

  getPastBookingsByGuestId (guestId) {
    return Booking.find({
      guestId: guestId,
      departureDate: {
        $lt: moment().format('YYYY-MM-DD')
      }
    }).sort('-arrivalDate');
  },

  getCurrentBookingsByGuestId (guestId) {
    return Booking.find({
      guestId: guestId,
      departureDate: {
        $gte: moment().format('YYYY-MM-DD')
      },
      arrivalDate: {
        $lte: moment().format('YYYY-MM-DD')
      }
    }).sort('-arrivalDate');
  },

  getFutureBookingsByGuestId (guestId) {
    return Booking.find({
      guestId: guestId,
      arrivalDate: {
        $gt: moment().format('YYYY-MM-DD')
      },
    }).sort('arrivalDate');
  },

  /* getAllocationById (id) {
    return Allocation.findOne({
      _id: id
    });
  },

  deleteAllocationById (id) {
    return Allocation.findOneAndDelete({
      _id: id
    });
  },
 */
  createNewBooking (newBooking) {
    return newBooking.save();
  }
}

module.exports = BookingController;