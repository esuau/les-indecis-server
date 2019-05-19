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

/* GET all vehicles. */
router.get('/', function (req, res, next) {
  //if there are no coordinates, return all spots, otherwise return spots around coordinates
  var request = "SELECT * FROM vehicules ;";
  pool.query(request, (err, r) => {
    if (err) {
      res.status(500).json({message: 'Error while reading notifications from DB : ' + err}); 
    } else {
      res.json(r.rows);
    }
  });
});

module.exports = router;
