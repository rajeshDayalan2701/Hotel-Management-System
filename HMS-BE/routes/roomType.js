const express = require('express');
const router = express.Router();
const RoomType = require('../models/RoomType');
const RoomTypeController = require('../controller/RoomTypeController');
const RoomController = require('../controller/RoomController');

router.get('/', (req, res) => {
  RoomTypeController.getAllRoomTypes()
    .then((roomTypes) => {
      res.send(roomTypes);
    })
});

router.post('/', (req, res) => {
  RoomTypeController.getAllRoomTypes()
    .then((roomTypes) => {
      let error;
      roomTypes.forEach((roomType) => {
        if (roomType.shortCode.toLowerCase() === req.body.shortCode.toLowerCase()) {
          error = _constructError('ValidatorError', 'Short Code should be unique', 'RoomType validation failed');
        }
      });

      if (error) {
        res.status(400).send(error);
      } else {
        const newRoomType = new RoomType(req.body);
        return RoomTypeController.createNewRoomType(newRoomType)
      }
    }).then((roomType) => {
      res.send(roomType);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

router.get('/:id', (req, res) => {
  RoomTypeController.getRoomTypeById(req.params.id)
    .then((roomType) => {
      if (roomType) {
        res.send(roomType);
      } else {
        res.status(400).send('Room Type not found');
      }
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.put('/:id', (req, res) => {
  let roomTypeId = req.params.id;
  RoomTypeController.getRoomTypeById(roomTypeId)
    .then((roomTypeToUpdate) => {
      RoomTypeController.getAllRoomTypes()
        .then((roomTypes) => {
          let error;
          roomTypes.forEach((roomType) => {
            if (roomType.shortCode.toLowerCase() === req.body.shortCode.toLowerCase() && roomType._id.toString() !== roomTypeId) {
              error = _constructError('ValidatorError', 'Short Code should be unique', 'RoomType validation failed');
            }
          });

          if (error) {
            res.status(400).send(error);
          } else {
            Object.assign(roomTypeToUpdate, req.body);
            RoomTypeController.createNewRoomType(roomTypeToUpdate)
              .then((roomType) => {
                res.send(roomType)
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
  let roomTypeId = req.params.id;
  RoomController.getRoomsByRoomTypeId(roomTypeId)
    .then((rooms) => {
      if (rooms && rooms.length) {
        let roomNumbersAssciatedWithRoomType = '';
        rooms.forEach((room, index) => {
          (index === rooms.length - 1) ? roomNumbersAssciatedWithRoomType += room.roomNumber : roomNumbersAssciatedWithRoomType += `${room.roomNumber}, `;
        });
        let error = _constructError('ValidatorError', `Room Number(s) ${roomNumbersAssciatedWithRoomType} is associated with this Room Type. Please remove those room(s) to delete this room type.`, 'Room Type validation failed');
        res.status(400).send(error);
      } else {
        return RoomTypeController.deleteRoomTypeById(roomTypeId)
      }
    }).then(() => {
      res.status(200).send('Room Type deleted successfully');
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