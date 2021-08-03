const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middleware
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()); //to allow requests from localhost

//Database connectivity
mongoose.connect(process.env.DB_URL, { 
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(() => {
  console.log('Error reaching to MongoDB');
});


//routes
app.get('/', (req, res) => {
  res.send('hello world');
})

//route middleware
app.use('/roomTypes', require('./routes/roomType'));
app.use('/floors', require('./routes/floor'));
app.use('/amenities', require('./routes/amenity'));
app.use('/rooms', require('./routes/room'));
app.use('/guests', require('./routes/guest'));
app.use('/allocations', require('./routes/allocation'));
app.use('/bookings', require('./routes/booking'));
app.use('/dashboard', require('./routes/dashboard'));

//Port connectivity
app.listen(process.env.PORT, () => {
  console.log(`App running in port ${process.env.PORT}`);
});