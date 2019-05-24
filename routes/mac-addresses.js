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

/* GET mac addresses. */
router.get('/', function (req, res, next) {
  var request = "SELECT address FROM authorized_addresses ;";
  pool.query(request, (err, r) => {
    if (err) {
      res.status(500).send("Error while reading notifications from DB : " + err);
    } else {
      res.json(r.rows);
    }
  });
});

module.exports = router;
