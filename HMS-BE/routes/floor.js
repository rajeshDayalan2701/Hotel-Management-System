const express = require('express');
const router = express.Router();
const Floor = require('../models/Floor');
const FloorController = require('../controller/FloorController');
const RoomController = require('../controller/RoomController');

router.get('/', (req, res) => {
  FloorController.getAllFloors()
    .then((floors) => {
      res.send(floors);
    })
});

router.post('/', (req, res) => {
  Floor.find({})
    .then((floors) => {
      let error;
      floors.forEach((floor) => {
        if (floor.floorNumber === req.body.floorNumber) {
          error = {
            errors: {
              title: {
                  name: "ValidatorError",
                  message: "Floor Number should be unique"
              }
            },
            _message: "Floor validation failed",
            name: "ValidationError",
            message: "Floor validation failed: Floor Number should be unique"
          };
        }
      });

      if (error) {
        res.status(400).send(error);
      } else {
        const newFloor = new Floor(req.body);
        FloorController.createNewFloor(newFloor)
          .then((floor) => {
            res.send(floor)
          }).catch((err) => {
            res.status(400).send(err);
          });
      }
    });
});

router.get('/:id', (req, res) => {
  FloorController.getFloorById(req.params.id)
    .then((floor) => {
      res.send(floor);
    }).catch ((err) => {
      res.status(400).send(err);
    })
});

router.put('/:id', (req, res) => {
  let floorId = req.params.id;
  Floor.findOne({
    _id: floorId
  }).then((floorToUpdate) => {
    Floor.find({})
      .then((floors) => {
        let error;
        floors.forEach((floor) => {
          if (floor.floorNumber === req.body.floorNumber && floor._id.toString() !== floorId) {
            error = {
              errors: {
                title: {
                    name: "ValidatorError",
                    message: "Floor Number should be unique"
                }
              },
              _message: "Floor validation failed",
              name: "ValidationError",
              message: "Floor validation failed: Floor Number should be unique"
            };
          }
        });

        if (error) {
          res.status(400).send(error);
        } else {
          Object.assign(floorToUpdate, req.body);
          FloorController.createNewFloor(floorToUpdate)
            .then((floor) => {
              res.send(floor)
            }).catch((err) => {
              res.status(400).send(err);
            });
        }
      }).catch((err) => {
        res.status(500).json(err);
      });
  }).catch ((err) => {
    res.status(400).send(err);
  });
});

router.delete('/:id', (req, res) => {
  let floorId = req.params.id;
  RoomController.getRoomsByFloorId(floorId)
    .then((rooms) => {
      if (rooms && rooms.length) {
        let roomNumbersAssciatedWithFloor = '';
        rooms.forEach((room, index) => {
          (index === rooms.length - 1) ? roomNumbersAssciatedWithFloor += room.roomNumber : roomNumbersAssciatedWithFloor += `${room.roomNumber}, `;
        });
        let error = _constructError('ValidatorError', `Room Number(s) ${roomNumbersAssciatedWithFloor} is associated with this floor. Please remove those rooms to delete this floor.`, 'Floor validation failed');
        res.status(400).send(error);
      } else {
        return FloorController.deleteFloorById(floorId)
      }
    }).then(() => {
      res.status(200).send('Floor deleted successfully');
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

