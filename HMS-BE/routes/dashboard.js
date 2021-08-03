const express = require('express');
const router = express.Router();
const axios = require('axios');

const RoomTypeController = require('../controller/RoomTypeController');
const RoomController = require('../controller/RoomController');
const AmenetiesController = require('../controller/AmenetiesController');
const FloorController = require('../controller/FloorController');

router.get('/hotelConfiguration', (req, res) => {
  axios.all([
    RoomTypeController.getRoomTypesCount(),
    RoomTypeController.getRoomTypesWithExtraBeds(),
    RoomController.getRoomsCount(),
    RoomController.getActiveRoomsCount(),
    FloorController.getFloorsCount(),
    FloorController.getActiveFloorsCount(),
    AmenetiesController.getAmenitiesCount(),
    AmenetiesController.getActiveAmenitiesCount(),
  ]).then(([roomTypesCount, roomTypesWithExtraBeds, roomsCount, activeRooms, floorsCount, activeFloors, amenetiesCount, activeAmenities]) => {
    res.json([
      {
        id: 'floors',
        label: 'Total Floors',
        count: floorsCount,
        meta: {
          label: 'Active Floors',
          count: activeFloors
        }
      },
      {
        id: 'roomTypes',
        label: 'Total Room Types',
        count: roomTypesCount,
        meta: {
          label: 'Rooms with Extra Beds',
          count: roomTypesWithExtraBeds
        }
      },
      {
        id: 'rooms',
        label: 'Total Rooms',
        count: roomsCount,
        meta: {
          label: 'Active Rooms',
          count: activeRooms
        },
      },
      {
        id: 'amenities',
        label: 'Total Amenities',
        count: amenetiesCount,
        meta: {
          label: 'Active Amenities',
          count: activeAmenities
        },
      }
    ]);
  });
});

module.exports = router;