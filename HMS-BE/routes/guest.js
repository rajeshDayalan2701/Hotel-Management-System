const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const GuestController = require('../controller/GuestController');
const BookingController = require('../controller/BookingController');

router.get('/', (req, res) => {
  GuestController.getAllGuests()
    .then((guests) => {
      res.send(guests);
    })
});

router.post('/', (req, res) => {
  GuestController.getAllGuests()
    .then((guests) => {
      let error;
      guests.forEach((guest) => {
        if (guest.emailId.toLowerCase() === req.body.emailId.toLowerCase()) {
          error = _constructError('ValidatorError', 'Email Id Already registered', 'Guest validation failed');
        }
        if (guest.phoneNumber.toLowerCase() === req.body.phoneNumber.toLowerCase()) {
          error = _constructError('ValidatorError', 'Mobile Number Already registered', 'Guest validation failed');
        }
      });

      if (error) {
        res.status(400).send(error);
      } else {
        const newGuest = new Guest(req.body);
        return GuestController.createNewGuest(newGuest)
      }
    }).then((guest) => {
      res.send(guest);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

router.get('/:id', (req, res) => {
  GuestController.getGuestById(req.params.id)
    .then((guest) => {
      if (guest) {
        res.send(guest);
      } else {
        res.status(400).send('Guest not found');
      }
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.get('/:id/pastBookings', (req, res) => {
  let guestId = req.params.id;
  BookingController.getPastBookingsByGuestId(guestId)
    .then((bookings) => {
      res.json(bookings);
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.get('/:id/futureBookings', (req, res) => {
  let guestId = req.params.id;
  BookingController.getFutureBookingsByGuestId(guestId)
    .then((bookings) => {
      res.json(bookings);
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.get('/:id/currentBookings', (req, res) => {
  let guestId = req.params.id;
  BookingController.getCurrentBookingsByGuestId(guestId)
    .then((bookings) => {
      res.json(bookings);
    }).catch ((err) => {
      res.status(400).send(err);
    });
});

router.put('/:id', (req, res) => {
  let guestId = req.params.id;
  GuestController.getGuestById(guestId)
    .then((guestToUpdate) => {
      GuestController.getAllGuests()
        .then((guests) => {
          let error;
          guests.forEach((guest) => {
            if (guest.emailId.toLowerCase() === req.body.emailId.toLowerCase() && guest._id.toString() !== guestId) {
              error = _constructError('ValidatorError', 'Email Id Already registered', 'Guest validation failed');
            }
            if (guest.phoneNumber.toLowerCase() === req.body.phoneNumber.toLowerCase() && guest._id.toString() !== guestId) {
              error = _constructError('ValidatorError', 'Mobile Number Already registered', 'Guest validation failed');
            }
          });

          if (error) {
            res.status(400).send(error);
          } else {
            Object.assign(guestToUpdate, req.body);
            GuestController.createNewGuest(guestToUpdate)
              .then((guest) => {
                res.send(guest)
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
  GuestController.deleteGuestById(req.params.id)
    .then(() => {
      res.status(200).send('Guest deleted successfully');
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