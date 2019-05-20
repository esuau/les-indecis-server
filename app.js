var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cron = require('node-cron');
const request = require('request');

const helper = require('./util/helper');
const config = helper.readConfig('./conf/config.json');
const pg = require('pg');
const pool = new pg.Pool({
  user: config.psql.user,
  host: config.psql.host,
  database: config.psql.database,
  password: config.psql.password,
  port: config.psql.port
});

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

cron.schedule('* * * * *', () => {
  request('http://api.undefined.inside.esiag.info/get_msg?queue=test', { json: false }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    if (body.content != undefined) {
      var msg = body.content.data.toString();
      pool.query("SELECT MAX(ID) AS mid FROM notification;", (err, r) => {
        if (err) {
          res.status(500).json({message: 'Error while reading id from DB : ' + err});
        } else {
          var id = r.rows[0].mid + 1;
          pool.query("INSERT INTO notification VALUES (" + id + ", '" + msg + "', NOW(), '" + planned_at + "', '##') ;", (err, r) => {
            if (err) {
              res.status(500).json({message: 'Error while adding notification in DB : ' + err});
            } else {
              res.send('Notification ajoutée avec succés !');
            }
          });
        }
      });
    };
  });
});

cron.schedule('* * * * *', () => {
  var today = new Date(Date.now()).toLocaleString();
  while (today.indexOf('/') != -1) {
    today = today.replace('/', '-');
  }
  today = today.split(' ')[0];
  var tab = today.split('-');
  today = '' + tab[2] + '-' + tab[1] + '-' + tab[0];

  pool.query("SELECT * FROM notification WHERE planned_at::text LIKE '" + today + "%' ;", (err, r) => {
    if (err) {
      console.error('Error while reading id from DB : ' + err);
    }
  });
});

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
