const express = require('express');
const router = express.Router();
const Allocation = require('../models/Allocation');
const AllocationController = require('../controller/AllocationController');

router.get('/', (req, res) => {
  AllocationController.getAllAllocations()
    .then((allocations) => {
      res.send(allocations);
    })
});

router.post('/', (req, res) => {
  const newAllocation = new Allocation(req.body);
  AllocationController.createNewAllocation(newAllocation)
    .then((allocation) => {
      res.send(allocation);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

function _constructError (errorType, message, failureMessage) {
  return {
    errors: {
      title: {
          name: errorType,
          message: message
      }
    },
    _message: failureMessage,
    name: errorType,
    message: `${failureMessage}: ${message}`
  };
}

module.exports = router;