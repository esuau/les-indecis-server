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
  var msg = decodeURIComponent(req.body.msg);
  var planned_at = decodeURIComponent(req.body.planned);

  pool.query("SELECT MAX(ID) AS mid FROM notification;", (err, r) => {
    if (err) {
      res.status(500).json({message: 'Error while reading id from DB : ' + err});
    } else {
      var id = r.rows[0].mid + 1;
      pool.query("INSERT INTO notification VALUES (" + id + ", '" + msg + "', NOW(), NOW()) ;", (err, r) => {
        if (err) {
          res.status(500).json({message: 'Error while adding notification in DB : ' + err});
        } else {
          res.send('Notification ajoutée avec succès !');
        }
      });
    }
  });
  return;
});

module.exports = router;
