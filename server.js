(function(){
'use strict';
var port = process.argv[2] || 8080,
    express     = require( 'express' ),
    app         = express(),
    mongoose    = require( 'mongoose' ),
    bodyParser  = require( 'body-parser' ),
    cors        = require( 'cors' ),

    userCtrl    = require( './api/ctrls/userCtrl.js' ),
    subCtrl     = require( './api/ctrls/subCtrl.js' ),

    config      = require( './api/config.js' ),
    session     = require( 'express-session' ),
    passport    = require( 'passport' ),
    GoogleStrategy    = require( 'passport-google-oauth2' ).Strategy,
    FacebookStrategy  = require( 'passport-facebook' ).Strategy,
    // TwitterStrategy   = require( 'passport-twitter' ).Strategy

    nodemailer  = require('nodemailer'),
    CronJob     = require('cron').CronJob;

// Connect to MongoDB via Mongoose
mongoose.connect('mongodb://localhost:27017/recur');
mongoose.connection.once('open', function(){console.log('mdb listening on 27017');});

// Passport session setup
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });

// Passport Strategies
passport.use('google', new GoogleStrategy({
  clientID: config.google.key,
  clientSecret: config.google.secret,
  callbackURL: 'http://dev.recur.com:8080/auth/google/callback',
  passReqToCallback: true
  }, function(request, accessToken, refreshToken, profile, done) {
    userCtrl.findOrCreate(profile, done).then(function(user){
      return done(null, user);
    });
  }
));
passport.use('facebook', new FacebookStrategy({
  clientID: config.facebook.key,
  clientSecret: config.facebook.secret,
  callbackURL: 'http://dev.recur.com:8080/auth/facebook/callback',
  profileFields : ['id', 'displayName', 'emails']
  }, function(token, secret, profile, done){
    userCtrl.findOrCreate(profile, done).then(function(user){
      return done(null, user);
    });
  }
));
// passport.use('twitter', new TwitterStrategy({
//   consumerKey: config.twitter.key
// , consumerSecret: config.twitter.secret
// , callbackURL: 'http://dev.recur.com:8080/auth/twitter/callback'
// , profileFields : ['id', 'displayName', 'emails']
//   }, function(token, secret, profile, done) {
// //     console.log('TWITTTTTTTTTTER ', profile);
//     userCtrl.findOrCreate(profile, done).then(function(user){
//       return done(null, user);
//     })
//   }
// ));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(403).send('not authenticated');
}

// Express config & middleware
app.use('/', express.static(__dirname + '/public'));
app.use('/', bodyParser.json());
app.use('/', cors());
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
// app.get('/auth/twitter', passport.authenticate('twitter', {scope: [ 'email' ] }));
// app.get('/auth/twitter/callback', passport.authenticate('twitter', {
//   successRedirect: '/complete',
//   failureRedirect: '/'
// }));
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// API ENDPOINTS
// app.post('/api/user', userCtrl.create)
app.get(    '/api/user/',         userCtrl.retrieve);
app.put(    '/api/user/:user_id', userCtrl.update);
app.delete( '/api/user/:user_id', userCtrl.remove);

app.post(   '/api/sub',           subCtrl.create);
app.get(    '/api/sub',           subCtrl.retrieve);
app.put(    '/api/sub/:sub_id',   subCtrl.update);
app.delete( '/api/sub/:sub_id',   subCtrl.remove);



app.listen(port, function(){console.log('srv listening on', port);});


// ---------- NODEMAILER ----------
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.nodemailerGmail.username,
      pass: config.nodemailerGmail.password
    }
});

var testEmail = function(mailOptions){
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  });
};

// ---------- DAILY EMAIL CRON JOB ----------
var job = new CronJob({
  cronTime: '00 37 07 * * 1-7',
  onTick: function(){
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
    userCtrl.mail().then(function(res){
      var user = res;
      var body = '';
      for (var i = 0; i < user.subs.length; i++) {
        var sub = user.subs[i];
        body += sub.name + ' @ $' + sub.cost + ' per month ($' + sub.cost*12 + 'per year),';
      }
      var mailOptions = {
        from: 'Recurring Subscription Reminder <recurrecurrecur+noreply@gmail.com>', // sender address
        replyTo: 'noreply@dev.recur.com',
        to: user.email, // list of receivers
        subject: 'Are you still using these services?', // Subject line
        text: 'Are you sure you still need these??? --- ' + body // plaintext body
      };
      testEmail(mailOptions);
    });
  },
  onComplete: function(){
    console.log('cron job complete at ', Date.now);
  },
  start: false,
  timeZone: 'America/Denver'
});
job.start();

})();

// UNDO/CANCEL INSTEAD OF SAVE
// cron job email
// cron job update sub ranking
// get top 30 most popular services, with suggested cost (pagination i guess)
// add custom
// Twitter login (email complete)
   // MAYBE JUST EMAIL BOX ABOVE SUBS LIST???

// openshift ???
// modal on the side
// video background
// responsive
// bower
// log in, see subscriptions, edit subscriptions (then update), edit email (then update)
// text message, scour email (some sort of auto),


// 'Netflix'
// 'Amazon Instant' 'Aamazon Subscribe & Save' 'Amazon Music'
// 'Hulu Plus'
// 'Cable TV'
// 'HBO'
// 'Showtime'
// 'Vudu'
// 'Flixster'
// 'Disney Movie Rewards'
// 'ESPN'
// 'Pandora'
// 'Spotify'
// 'Rdio'
// 'Rhapsody'
// 'Apple Music'
// 'iHeartRadio'
// 'Google Music'
// 'Dollar Shave Club'
// 'Jackthreads'
// 'Birchbox'
// 'Popular Science'
// 'National Geographic'
// Adobe CC
// Office 365
// iCloud
// Dropbox
