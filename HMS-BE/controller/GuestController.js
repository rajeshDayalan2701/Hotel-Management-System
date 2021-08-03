const Guest = require('../models/Guest');

const GuestController = {
  getAllGuests () {
    return Guest.find({}).sort('-createdAt');
  },

  getGuestById (id) {
    return Guest.findOne({
      _id: id
    });
  },

  deleteGuestById (id) {
    return Guest.findOneAndDelete({
      _id: id
    });
  },

  createNewGuest (newGuest) {
    return newGuest.save();
  }
}

module.exports = GuestController;