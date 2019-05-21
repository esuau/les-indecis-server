var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var heartbeatRouter = require('./routes/heartbeat');
var getNotificationsRouter = require('./routes/get-notifications');
var addNotificationsRouter = require('./routes/add-notifications');
var spotRouter = require('./routes/parking-spots');
var macAddressRouter = require('./routes/mac-addresses');
var vehiclesRouter = require('./routes/vehicles');
var invoicesRouter = require('./routes/invoices');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', heartbeatRouter);
app.use('/get_notifications', getNotificationsRouter);
app.use('/add_notification', addNotificationsRouter);
app.use('/get_spots', spotRouter);
app.use('/get_macs', macAddressRouter);
app.use('/get_vehicles', vehiclesRouter);
app.use('/generate_invoice', invoicesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error status
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
