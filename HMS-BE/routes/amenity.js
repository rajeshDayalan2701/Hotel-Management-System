const express = require('express');
const router = express.Router();

const Amenity = require('../models/Amenity');
const RoomTypeController = require('../controller/RoomTypeController');
const AmenetiesController = require('../controller/AmenetiesController');

router.get('/', (req, res) => {
  Amenity.find({})
    .then((amenities) => {
      res.send(amenities);
    })
});

router.post('/', (req, res) => {
  Amenity.find({})
    .then((amenities) => {
      let error;
      amenities.forEach((amenity) => {
        if (amenity.shortCode.toLowerCase() === req.body.shortCode.toLowerCase()) {
          error = {
            errors: {
              title: {
                  name: "ValidatorError",
                  message: "Amenity Short code should be unique"
              }
            },
            _message: "Amenity validation failed",
            name: "ValidationError",
            message: "Amenity validation failed: Amenity Short code should be unique"
          };
        }
      });

      if (error) {
        res.status(400).send(error);
      } else {
        const newAmenity = new Amenity(req.body);
        newAmenity.save()
          .then((amenity) => {
            res.send(amenity)
          }).catch((err) => {
            res.status(400).send(err);
          });
      }
    })
});

router.get('/:id', (req, res) => {
  Amenity.findOne({
    _id: req.params.id
  }).then((amenity) => {
    res.send(amenity);
  }).catch ((err) => {
    res.status(400).send(err);
  })
});

router.put('/:id', (req, res) => {
  let amenityId = req.params.id;
  Amenity.findOne({
    _id: amenityId
  }).then((amenityToUpdate) => {
    Amenity.find({})
      .then((amenities) => {
        let error;
        amenities.forEach((amenity) => {
          if (amenity.shortCode.toLowerCase() === req.body.shortCode.toLowerCase() && amenity._id.toString() !== amenityId) {
            error = {
              errors: {
                title: {
                    name: "ValidatorError",
                    message: "Amenity Short code should be unique"
                }
              },
              _message: "Amenity validation failed",
              name: "ValidationError",
              message: "Amenity validation failed: Amenity Short code should be unique"
            };
          }
        });

        if (error) {
          res.status(400).send(error);
        } else {
          Object.assign(amenityToUpdate, req.body);
          amenityToUpdate.save()
            .then((amenity) => {
              res.send(amenity)
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
  let amenityId = req.params.id;
  RoomTypeController.getRoomTypesByAmenityId(amenityId)
    .then((roomTypes) => {
      if (roomTypes && roomTypes.length) {
        let roomTypesAssciatedWithAmenity = '';
        roomTypes.forEach((roomType, index) => {
          (index === roomTypes.length - 1) ? roomTypesAssciatedWithAmenity += roomType.title : roomTypesAssciatedWithAmenity += `${roomType.title}, `;
        });
        let error = _constructError('ValidatorError', `Room Type(s) ${roomTypesAssciatedWithAmenity} is associated with this Amenity. Please remove this association with these Room Type(s) to delete this Amenity.`, 'Amenity validation failed');
        res.status(400).send(error);
      } else {
        return AmenetiesController.deleteAmenityById(amenityId)
      }
    }).then(() => {
    res.status(200).send('Amenity deleted successfully');
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