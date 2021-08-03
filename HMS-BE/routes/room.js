const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Floor = require('../models/Floor');
const RoomType = require('../models/RoomType');

const RoomController = require('../controller/RoomController');
const RoomTypeController = require('../controller/RoomTypeController');
const AllocationController = require('../controller/AllocationController');
const BookingController = require('../controller/BookingController');

router.get('/', (req, res) => {
  RoomController.getAllRooms()
    .then((rooms) => {
      res.send(rooms);
    })
});

router.post('/', (req, res) => {
  RoomController.getAllRooms()
    .then((rooms) => {
      let error;
      rooms.forEach((room) => {
        if (room.roomNumber.toLowerCase() === req.body.roomNumber.toLowerCase()) {
          error = {
            errors: {
              title: {
                  name: "ValidatorError",
                  message: "Room Number should be unique"
              }
            },
            _message: "Room validation failed",
            name: "ValidationError",
            message: "Room validation failed: Room Number should be unique"
          };
        }
      });

      if (error) {
        res.status(400).send(error);
      } else {
        Floor.find({})
          .then((floors) => {
            let matchingFloorIndex = floors.findIndex((floor) => {
              if (floor._id.toString() === req.body.floorId) {
                return true;
              }
            });

            if (matchingFloorIndex === -1) {
              error = {
                errors: {
                  title: {
                      name: "ValidatorError",
                      message: "Floor not find. Please select a valid floor"
                  }
                },
                _message: "Room validation failed",
                name: "ValidationError",
                message: "Room validation failed: Floor not find. Please select a valid floor"
              };
            }

            if (error) {
              res.status(400).send(error);
            } else {
              RoomType.find({})
                .then((roomTypes) => {
                  let matchingRoomTypeIndex = roomTypes.findIndex((roomType) => {
                    if (roomType._id.toString() === req.body.roomTypeId) {
                      return true;
                    }
                  });

                  if (matchingRoomTypeIndex === -1) {
                    error = {
                      errors: {
                        title: {
                            name: "ValidatorError",
                            message: "Room Type not find. Please select a valid roomtype"
                        }
                      },
                      _message: "Room validation failed",
                      name: "ValidationError",
                      message: "Room validation failed: Room Type not find. Please select a valid roomtype"
                    };
                  }

                  if (error) {
                    res.status(400).send(error);
                  } else {
                    const newRoom = new Room(req.body);
                    RoomController.createNewRoom(newRoom)
                      .then((room) => {
                        res.send(room)
                      }).catch((err) => {
                        res.status(400).send(err);
                      });
                  }
                });
            }
          });
      }
    });
});

router.get('/:id', (req, res) => {
  RoomController.getRoomById(req.params.id)
    .then((room) => {
      res.send(room);
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.put('/:id', (req, res) => {
  let roomId = req.params.id;
  Room.findOne({
    _id: roomId
  }).then((roomToUpdate) => {
    if (roomToUpdate) {
      Room.find({})
        .then((rooms) => {
          let error;
          rooms.forEach((room) => {
            if (room.roomNumber.toLowerCase() === req.body.roomNumber.toLowerCase() && room._id.toString() !== roomId) {
              error = {
                errors: {
                  title: {
                      name: "ValidatorError",
                      message: "Room Number should be unique"
                  }
                },
                _message: "Room validation failed",
                name: "ValidationError",
                message: "Room validation failed: Room Number should be unique"
              };
            }
          });
    
          if (error) {
            res.status(400).send(error);
          } else {
            Floor.find({})
              .then((floors) => {
                let matchingFloorIndex = floors.findIndex((floor) => {
                  if (floor._id.toString() === req.body.floorId) {
                    return true;
                  }
                });
    
                if (matchingFloorIndex === -1) {
                  error = {
                    errors: {
                      title: {
                          name: "ValidatorError",
                          message: "Floor not find. Please select a valid floor"
                      }
                    },
                    _message: "Room validation failed",
                    name: "ValidationError",
                    message: "Room validation failed: Floor not find. Please select a valid floor"
                  };
                }
    
                if (error) {
                  res.status(400).send(error);
                } else {
                  RoomType.find({})
                    .then((roomTypes) => {
                      let matchingRoomTypeIndex = roomTypes.findIndex((roomType) => {
                        if (roomType._id.toString() === req.body.roomTypeId) {
                          return true;
                        }
                      });
    
                      if (matchingRoomTypeIndex === -1) {
                        error = {
                          errors: {
                            title: {
                                name: "ValidatorError",
                                message: "Room Type not find. Please select a valid roomtype"
                            }
                          },
                          _message: "Room validation failed",
                          name: "ValidationError",
                          message: "Room validation failed: Room Type not find. Please select a valid roomtype"
                        };
                      }
    
                      if (error) {
                        res.status(400).send(error);
                      } else {
                        Object.assign(roomToUpdate, req.body);
                        RoomController.createNewRoom(roomToUpdate)
                          .then((room) => {
                            res.send(room)
                          }).catch((err) => {
                            res.status(400).send(err);
                          });
                      }
                    });
                }
              });
          }
        });
    } else {
      res.status(400).send('Room not found');
    }
  }).catch((err) => {
    res.status(400).json(error);
  });
});

router.delete('/:id', (req, res) => {
  let roomId = req.params.id;
  AllocationController.getActiveAllocationByRoomId(roomId)
    .then((allocations) => {
      if (allocations && allocations.length) {
        let allocationIds = allocations.map(allocation => allocation._id);
        BookingController.getBookingsByAllocationsIds(allocationIds)
          .then((bookings) => {
            let bookingAssociatedWithFloor = '';
            bookings.forEach((booking, index) => {
              (index === bookings.length - 1) ? bookingAssociatedWithFloor += booking.confirmationId : bookingAssociatedWithFloor += `${booking.confirmationId}, `;
            });
            let error = _constructError('ValidatorError', `Booking(s) ${bookingAssociatedWithFloor} is associated with this Room. Please wait for this Booking to Depart inorder to delete this Room`, 'Room validation failed');
            res.status(400).send(error);
          })
      } else {
        RoomController.deleteRoomById(roomId)
          .then(() => {
            res.status(200).send('Room deleted successfully');
          })
      }
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