const Allocation = require('../models/Allocation');
const moment = require('moment');

const AllocationController = {
  getAllAllocations () {
    return Allocation.find({}).sort('-createdAt');
  },

  getAllocationById (id) {
    return Allocation.findOne({
      _id: id
    });
  },

  getActiveAllocationByRoomId (roomId) {
    return Allocation.find({
      roomId: roomId,
      departureDate: {
        $gte: moment().format('YYYY-MM-DD')
      }
    });
  },

  deleteAllocationById (id) {
    return Allocation.findOneAndDelete({
      _id: id
    });
  },

  createNewAllocation (newAllocation) {
    return newAllocation.save();
  }
}

module.exports = AllocationController;