'use strict';
var port = process.argv[2] || 8080;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recur');
mongoose.connection.once('open', function(){console.log('mdb listening on 27017')});
var ProductCtrl = require('./productCtrl.js');
var CartCtrl = require('./cartCtrl.js');
var OrderCtrl = require('./orderCtrl.js');

var app = require('express')();
app.use('/', require('express').static(__dirname + '/public'));
app.use('/', require('body-parser').json());
app.use('/', require('cors')());
app.post('/api/product', ProductCtrl.create);
app.get('/api/product', ProductCtrl.read);
app.put('/api/product/:id', ProductCtrl.update);
app.delete('/api/product/:id', ProductCtrl.remove);
app.post('/api/order', OrderCtrl.create);
app.get('/api/order', OrderCtrl.read);
app.post('/api/cart', CartCtrl.create);
app.put('/api/cart', CartCtrl.update);
app.listen(port, function(){console.log('srv listening on', port)});


// Netflix
// Amazon Instant
// Aamazon Subscribe & Save
// Hulu Plus
// Cable TV
// HBO
// Showtime
// Vudu
// Flixster
// Disney
// ESPN
// Pandora
// Spotify
// Rdio
// Rhapsody
// Apple MusiciHeartRadio
// Amazon Music
// Google Music
// Dollar Shave Club
// Jackthreads
// Birchbox
// Magazine
// National Geographic
