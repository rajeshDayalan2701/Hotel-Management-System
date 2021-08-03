const Amenity = require('../models/Amenity');

const AmenetiesController = {
  getAllAmeneties () {
    return Amenity.find({}).sort('-createdAt');
  },

  getAmenitiesCount () {
    return Amenity.count()
  },

  getActiveAmenitiesCount () {
    return Amenity.count({
      isActive: true
    })
  },
  deleteAmenityById (amenityId) {
    return Amenity.findOneAndDelete({
      _id: amenityId
    });
  }
}

module.exports = AmenetiesController;