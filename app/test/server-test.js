var assert = require('chai').assert
const sinon = require('sinon')
var chai = require('chai')
var chaiHttp = require('chai-http')
var request = require('supertest')
chai.use(chaiHttp)
var spy = sinon.spy()
let should = chai.should()

describe('Testing les-indecis-server', function() {
	describe('loading express', function () {
		var app
		
		before(function () {
		  app = require('../index.js')
		})
		after(function (){
		  process.exit()
		})

		it('isGettingMacsCorrectly', function testGetMacs(done) {
			this.timeout(10000)
			chai.request(app).get('/get_macs').end((err,res) => {
				res.should.have.status(200)
				var l = JSON.parse(res.text)
				l.forEach(function(e) {
					assert(e.address != undefined)
				})
				assert.notEqual(l.length, 0)
				done()
			})
		})
		
		it('isGettingNotificationsCorrectly', function testGetNotifications(done) {
			this.timeout(10000)
			chai.request(app).get('/get_notifications').end((err,res) => {
				res.should.have.status(200)
				var l = JSON.parse(res.text)
				assert.notEqual(l.length, 0)
				done()
			})
		})
		
		it('isGettingSpotsCorrectly', function testGetSpots(done) {
			this.timeout(10000)
			chai.request(app).get('/get_spots').end((err,res) => {
				res.should.have.status(200)
				done()
			})
		})
		
		it('isGettingVehiclesCorrectly', function testGetVehicles(done) {
			this.timeout(10000)
			chai.request(app).get('/get_vehicles').end((err,res) => {
				res.should.have.status(200)
				var l = JSON.parse(res.text)
				l.forEach(function(e) {
					assert(e.id != undefined && e.name != undefined && e.brand != undefined && e.model != undefined && e.status != undefined)
				})
				assert.notEqual(l.length, 0)
				done()
			})
		})
	})
})
