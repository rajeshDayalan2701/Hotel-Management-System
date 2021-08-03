const express = require('express');
const router = express.Router();
const moment = require('moment');

const RoomTypeController = require('../controller/RoomTypeController');
const AllocationController = require('../controller/AllocationController');
const BookingController = require('../controller/BookingController');
const RoomController = require('../controller/RoomController');
const Booking = require('../models/Booking');
const Allocation = require('../models/Allocation');

const dateFormat = 'YYYY-MM-DD';

router.get('/', (req, res) => {
  BookingController.getAllActiveBookings()
    .then((bookings) => {
      res.json(bookings);
    });
});

router.get('/pastBookings', (req, res) => {
  //Guard Clauses
  let startDate = req.query.startDate || moment().subtract(11, 'days').format('YYYY-MM-DD');
  if (!moment(startDate).isBefore(moment().format('YYYY-MM-DD'))) {
    res.status(400).send('Start Date should be before Current Date');
    return;
  }

  let endDate = req.query.endDate || moment().subtract(1, 'days').format('YYYY-MM-DD');
  if (!moment(endDate).isBefore(moment().format('YYYY-MM-DD'))) {
    res.status(400).send('End Date should be before Current Date');
    return;
  }

  if (moment(endDate).isBefore(moment(startDate))) {
    res.status(400).send('End Date should be after Start Date');
    return;
  }

  BookingController.getPastBookings(startDate, endDate)
    .then((bookings) => {
      res.json(bookings);
    });
});

router.get('/futureBookings', (req, res) => {
  //Guard Clauses
  let startDate = req.query.startDate || moment().add(1, 'days').format('YYYY-MM-DD');
  if (!moment(startDate).isAfter(moment().format('YYYY-MM-DD'))) {
    res.status(400).send('Start Date should be after Current Date');
    return;
  }

  let endDate = req.query.endDate || moment().add(11, 'days').format('YYYY-MM-DD');
  if (!moment(endDate).isAfter(moment().format('YYYY-MM-DD'))) {
    res.status(400).send('End Date should be after Current Date');
    return;
  }

  if (moment(endDate).isBefore(moment(startDate))) {
    res.status(400).send('End Date should be after Start Date');
    return;
  }
  
  BookingController.getFutureBookings(startDate, endDate)
    .then((bookings) => {
      res.json(bookings);
    });
});

router.post('/checkAvailableRooms', (req, res) => {
  const { arrivalDate, departureDate, adults, kids, roomTypeId } = req.body;
  RoomTypeController.getRoomTypeById(roomTypeId)
    .then((roomType) => {
      let allocations;
      if (adults > roomType.higherOccupancy) {
        throw `Adults count exceeds the maximum guests allowed in the ${ roomType.title }`;
      }
      if (kids > roomType.kidsOccupancy) {
        throw `Kids count exceeds the maximum guests allowed in the ${ roomType.title }`;
      }
      if (!moment(arrivalDate).isBefore(departureDate)) {
        throw `Arrival Date should be before Depature Date`;
      }
      
      return AllocationController.getAllAllocations()
    }).then((response) => {
      allocations = response;
      return RoomController.getRoomsByRoomTypeId(roomTypeId);
    }).then((roomsUnderSelectedRoomType) => {
      let bookingDates = fetchDates(arrivalDate, departureDate);
      //rooms which are available for the given dates
      let availableRooms = roomsUnderSelectedRoomType.filter((room) => {
        let filteredAllocationsByRoomId = allocations.filter((allocation) => allocation.roomId === room._id.toString());
        return !filteredAllocationsByRoomId.some((allocation) => {
          let allocationDates = fetchDates(allocation.arrivalDate, allocation.departureDate);
          return allocationDates.some((date) => bookingDates.includes(date));
        });
      });
      res.send(availableRooms);
    }).catch((err) => {
      let error = _constructError('ValidatorError', err, 'RoomType occupancy validation failed')
      res.status(400).send(error);
    });
});

router.post('/createBooking', (req, res) => {
  const { arrivalDate, departureDate, adults, kids, roomTypeId, roomId, guestId } = req.body;

  let bookingDetails = {
    ...req.body,
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING'
  };

  //creating allocation
  let newAllocation = new Allocation({
    arrivalDate,
    departureDate,
    roomTypeId,
    roomId
  });
  AllocationController.createNewAllocation(newAllocation)
    .then((allocation) => {
      bookingDetails.allocationId = allocation._id;
      bookingDetails.confirmationId = generateConfirmationId();
      return RoomTypeController.getRoomTypeById(roomTypeId)
    }).then((roomType) => {
      const { baseOccupancy, extraPersonPrice, basePrice } = roomType;
      let price = basePrice;
      if (adults > baseOccupancy) {
        price += (adults - baseOccupancy) * extraPersonPrice;
      }
      let bookingDates = fetchDates(arrivalDate, departureDate);
      let dailyRates = {};
      bookingDates.forEach((date) => {
        dailyRates[date] = price;
      });
      bookingDetails.dailyRates = dailyRates;
      bookingDetails.bookingDate = moment().format(dateFormat);

      let newBooking = new Booking(bookingDetails);
      return BookingController.createNewBooking(newBooking);
    }).then((booking) => {
      res.send(booking);
    }).catch((err) => {
      res.err(400).send(err)
    })
});

function fetchDates (startDate, endDate) {
  let dates = [];
  while(startDate !== endDate) {
    dates.push(startDate);
    startDate = moment(startDate).add(1, 'Days').format(dateFormat);
  }
  return dates;
}

function generateConfirmationId () {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let charactersLength = characters.length;
  for (let i = 0; i < 8; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
}

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