const express = require('express');
const morgan = require('morgan');
const pg = require('pg');
const pool = new pg.Pool({
user: 'postgres',
host: 'bdd-vip.undefined.inside.esiag.info',
database: 'pds',
password: 'undefined',
port: '5432'});

const app = express();
app.use(morgan('combined'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/heartbeat.json')
});

app.get('/get_notifications', (req, res) => {
	pool.query("SELECT * FROM notification;", (err, r) => {
		if(err) {res.send("Error while reading notifications from DB : " + err); }
		else 
		{
			res.send(r.rows);
		}
	});
});

// Url shortening, POST /shorten
app.post('/add_notification', (req, res, next) => {
	var msg = decodeURIComponent(req.body.msg) ;
	var planned_at = decodeURIComponent(req.body.planned) ;
	pool.query("SELECT MAX(ID) AS mid FROM notification;", (err, r) => {
		if(err) { res.send("Error while reading id from DB : " + err); }
		else 
		{
			var id = r.rows[0].mid + 1 ;
			pool.query("INSERT INTO notification VALUE (" + id + ", '" + msg + "', NOW(), '"+planned_at+"') ;", (err, r) => {
				if(err) { res.send("Error while adding notification in DB : " + err); }
				else {
					res.send("Notification ajoutée avec succés !");
				}
			});
		}
	});

});

var listener = app.listen(process.env.PORT || 80, function() {
 console.log('listening on port ' + listener.address().port);
});

process.once('SIGINT', function (code) {
    console.log('SIGINT received terminating pgdb connection');
	pool.close();
});

 // vs.

process.once('SIGTERM', function (code) {
	console.log('SIGTERM received terminating pgdb connection');
    pool.close();
});