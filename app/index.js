const cron = require('node-cron');
const express = require('express');
const morgan = require('morgan');
const pg = require('pg');
const pool = new pg.Pool({
	user: 'postgres',
	host: 'bdd-vip.undefined.inside.esiag.info',
	database: 'pds',
	password: 'undefined',
	port: '5432'
});
const request = require('request');
const pdfInvoice = require('pdf-invoice');
const fs = require('fs')

const app = express();
const bodyParser = require('body-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

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

//Request to get parking spots info close to client's location
app.get('/get_spots', (req, res) => {
	var longitude = "";
	var latitude = "";
//	if(req.body.hasAttribute(longitude) && req.body.hasAttribute(latitude)){
//        longitude = decodeURIComponent(req.body.longitude);
//        latitude = decodeURIComponent(req.body.latitude);
//	}

	//if there are no coordinates, return all spots, otherwise return spots around coordinates
	var request = "SELECT id,longitude,latitude,capacity,occupancy,designation,city FROM parking_spots";
	if(longitude != "" && latitude != ""){
        var request = "SELECT id,longitude,latitude,capacity,occupancy,designation,city FROM parking_spots WHERE longitude BETWEEN " +
            " "+(longitude-0.002)+" AND " +(longitude+0.002)+ " " +
            " AND latitude BETWEEN "+(latitude-0.002)+" AND "+(latitude+0.002)+" ";
	}
    pool.query(request, (err, r) => {
        if(err) {res.send("Error while reading notifications from DB : " + err); }
        else
        {
            res.send(r.rows);
        }
    });
});

// Request to trigger the generation of invoices.
app.post('/generate_invoice', (req, res) => {
	customer = req.body;
	pdfInvoice.lang = 'en_US';
	const document = pdfInvoice({
		company: {
			phone: '(99) 9 9999-9999',
			email: 'contact@undefined.com',
			address: '71, Rue Saint Simon, 94000 Créteil',
			name: 'Les Indécis',
		},
		customer: {
			name: customer.name,
			email: customer.email,
		},
		items: customer.items
	});
	document.generate();
	now = new Date();
	fileName = '/usr/shared/bill/'
		+ now.getFullYear()
		+ (now.getMonth() + 1)
		+ now.getDate()
		+ now.getHours()
		+ now.getMinutes()
		+ now.getSeconds()
		+ now.getMilliseconds()
		+ '.pdf';
	document.pdfkitDoc.pipe(fs.createWriteStream(fileName));
	res.send(200, { path: fileName });
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

cron.schedule('* * * * *', () => {
	request('http://api.undefined.inside.esiag.info/get_msg?queue=test', { json: false }, (err, res, body) => {
		if (err) { return console.log(err); }
		console.log(body);
		if(body.content != undefined)
		{
			var msg = body.content.data.toString();
			pool.query("SELECT MAX(ID) AS mid FROM notification;", (err, r) => {
				if(err) { res.send("Error while reading id from DB : " + err); }
				else 
				{
					var id = r.rows[0].mid + 1 ;
					pool.query("INSERT INTO notification VALUES (" + id + ", '" + msg + "', NOW(), '"+planned_at+"', '##') ;", (err, r) => {
						if(err) { res.send("Error while adding notification in DB : " + err); }
						else {
							res.send("Notification ajoutée avec succés !");
						}
					});
				}
			})
		};
	});
});

module.exports=app;
