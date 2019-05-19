var express = require('express');
var router = express.Router();

const helper = require('../util/helper');
const config = helper.readConfig('./conf/config.json');
const pg = require('pg');
const pool = new pg.Pool({
  user: config.psql.user,
  host: config.psql.host,
  database: config.psql.database,
  password: config.psql.password,
  port: config.psql.port
});

/* GET parking spots. */
router.get('/', function (req, res, next) {
  var longitude = '';
  var latitude = '';

  // If there are no coordinates, return all spots, otherwise return spots around coordinates
  var request = "SELECT id, longitude, latitude, capacity, occupancy, designation, city "
    + "FROM parking_spots";
  if (longitude != '' && latitude != '') {
    var request = "SELECT id, longitude, latitude, capacity, occupancy, designation, city "
      + "FROM parking_spots "
      + "WHERE longitude BETWEEN " + (longitude - 0.002) + " AND " + (longitude + 0.002)
      + " AND latitude BETWEEN " + (latitude - 0.002) + " AND " + (latitude + 0.002) + " ";
  }
  pool.query(request, (err, r) => {
    if (err) {
      res.status(500).json({message: 'Error while reading notifications from DB : ' + err});
    } else {
      res.json(r.rows);
    }
  });
  return;
});

module.exports = router;
