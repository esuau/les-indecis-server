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

/* GET notifications. */
router.get('/', function (req, res, next) {
  pool.query("SELECT * FROM notification;", (err, r) => {
    if (err) {
      res.status(500).json({message: 'Error while reading notifications from DB : ' + err});
    } else {
      res.json(r.rows);
    }
  });
  return;
});

module.exports = router;
