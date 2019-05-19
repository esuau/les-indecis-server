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

const pdfInvoice = require('pdf-invoice');
const fs = require('fs');

/* GET invoice. */
router.get('/', function (req, res, next) {
  paths = [];
  pool.query(`SELECT b.bill_id, a.firstname, a.lastname, a.email, b.totalprice, h.vehicle, h.description
			        FROM bill b, account a, historic h
	            LEFT JOIN account a2 on h.account_id = a2.user_id
	            LEFT JOIN bill b2 on h.historic_id = b2.historic_id
	            WHERE b.notification_status = 'pending';`, (err, r) => {
		if(err) {
			res.status(500).json({message: 'Error while reading notifications from DB : ' + err});
		} else {
			r.rows.forEach(element => {
				pdfInvoice.lang = 'en_US';
				const document = pdfInvoice({
					company: {
						phone: '(99) 9 9999-9999',
						email: 'contact@undefined.com',
						address: '71, Rue Saint Simon, 94000 Créteil',
						name: 'Les Indécis',
					},
					customer: {
						name: element.firstname + ' ' + element.lastname,
						email: element.email
					},
					items: [{
						amount: element.totalprice,
						name: element.vehicle,
						description: element.description
					}]
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
				console.log(element);
				console.log(fileName);
				paths.push({ path: fileName });
				pool.query("UPDATE bill SET notification_status = 'created' WHERE bill_id = " + element.bill_id + " ;", (eerr, u) => {
					if (eerr) {
						res.status(500).json({message: 'Could not update notification status: ' + eerr});
					}
				});
			});
			res.json({ paths: paths });
		}
  });
  return;
});

module.exports = router;
