'use strict';
var port = process.argv[2] || 8080
  , express     = require( 'express' )
  , app         = express()
  , mongoose    = require( 'mongoose' )
  , bodyParser  = require( 'body-parser' ).json()

  , userCtrl    = require( './api/ctrls/userCtrl.js' )
  , subCtrl     = require( './api/ctrls/subCtrl.js' )

  , config      = require( './api/config.js' )
  , session     = require( 'express-session' )
  , passport    = require( 'passport' )
  , GoogleStrategy    = require( 'passport-google-oauth2' ).Strategy
  , FacebookStrategy  = require( 'passport-facebook' ).Strategy
  , TwitterStrategy   = require( 'passport-twitter' ).Strategy

  , nodemailer  = require('nodemailer')
  , CronJob     = require('cron').CronJob

// Connect to MongoDB via Mongoose
mongoose.connect('mongodb://localhost:27017/recur');
mongoose.connection.once('open', function(){console.log('mdb listening on 27017')});

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Passport Strategies
passport.use('google', new GoogleStrategy({
  clientID: config.google.key,
  clientSecret: config.google.secret,
  callbackURL: 'http://dev.recur.com:8080/auth/google/callback',
  passReqToCallback: true
  }, function(request, accessToken, refreshToken, profile, done) {
//     console.log('----- SERVER LINE 37 -----', profile);
    userCtrl.findOrCreate(profile, done).then(function(user){
      return done(null, user);
    })
  }
));
passport.use('facebook', new FacebookStrategy({
  clientID: config.facebook.key
, clientSecret: config.facebook.secret
, callbackURL: 'http://dev.recur.com:8080/auth/facebook/callback'
, profileFields : ['id', 'displayName', 'emails']
  }, function(token, secret, profile, done){
//     console.log('----- SERVER LINE 48 -----', profile);
    userCtrl.findOrCreate(profile, done).then(function(user){
      return done(null, user);
    })
  }
));
passport.use('twitter', new TwitterStrategy({
  consumerKey: config.twitter.key
, consumerSecret: config.twitter.secret
, callbackURL: 'http://dev.recur.com:8080/auth/twitter/callback'
, profileFields : ['id', 'displayName', 'emails']
  }, function(token, secret, profile, done) {
//     console.log('----- SERVER LINE 59 -----', profile);
    userCtrl.findOrCreate(profile, done).then(function(user){
      return done(null, user);
    })
  }
));


// configure Express
app.use('/', express.static(__dirname + '/public'));
app.use('/', bodyParser);
// app.use('/', require('cors')());
app.use(session({
  secret: 'some-random-string',
  resave: 'false',
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', ensureAuthenticated);


// AUTH ENDPOINTS
app.get('/auth/google', passport.authenticate('google', {scope: [ 'email' ] } ));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/'
}));
app.get('/auth/facebook', passport.authenticate('facebook', {scope: [ 'email' ] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));
app.get('/auth/twitter', passport.authenticate('twitter', {scope: [ 'email' ] }));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/complete',
  failureRedirect: '/'
}));
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// FRONTEND ENDPOINTS
app
// .post('/api/user', userCtrl.create)
.get('/api/user/', userCtrl.retrieve)
.put('/api/user/:user_id', userCtrl.update)
.delete('/api/user/:user_id', userCtrl.remove)

.post('/api/sub', subCtrl.create)
.get('/api/sub', subCtrl.retrieve)
.put('/api/sub/:sub_id', subCtrl.update)
.delete('/api/sub/:sub_id', subCtrl.remove)


app.listen(port, function(){console.log('srv listening on', port)});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(403).send('not authenticated');
}

// ---------- NODEMAILER ----------
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.nodemailerGmail.username
    , pass: config.nodemailerGmail.password
    }
});
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Recurring Subscription Reminder <recurrecurrecur+noreply@gmail.com>' // sender address
  , replyTo: 'noreply@dev.recur.com'
  , to: 'mikkeld@gmail.com' // list of receivers
  , subject: 'Are you still using these services?' // Subject line
  , text: 'Are you sure???' // plaintext body
//   , html: '<b>Hello world ✔</b>' // html body
};
// send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         console.log(error);
//     }else{
//         console.log('Message sent: ' + info.response);
//     }
// });


// ---------- CRON JOB ----------
var job = new CronJob({
  cronTime: '00 30 11 * * 1-5'
, onTick: function(){
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
  }
, onComplete: function(){

  }
, start: false
, timeZone: 'America/Denver'
});
job.start();


// sessions / cookies (why logout on refresh?)
// random color associated with sub
// Google, Facebook, Twitter login
// Mandrill
// get top 30 services, with suggested cost
// add custom
// openshift ???
// modal on the side
// menu adapt
// video background
// responsive
// bower

// log in, see subscriptions, edit subscriptions (then update), edit email (then update) 
// text message, scour email (some sort of auto),
