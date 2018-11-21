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
	pool.query(“SELECT NOW()”, (err, res) => {
		console.log(res);
		pool.end();
	});
});



var listener = app.listen(process.env.PORT || 80, function() {
 console.log('listening on port ' + listener.address().port);
});