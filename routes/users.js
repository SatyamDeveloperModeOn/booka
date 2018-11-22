var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
// load the auth variables
var configAuth = require('./auth');

// Join
router.get('/join', function (req, res) {
    res.render('join', { message: req.flash('signupMessage') });
});

// // Join
// router.get('/Join', function (req, res) {
// 	res.render('join');
// });


// Login
router.get('/login', function (req, res) {
    res.render('login', { message: req.flash('loginMessage') });
});

// Dashboard
router.get('/Dashboard', ensureAuthenticated, function (req, res) {
    res.render('dashboard');
});

// // My Account
// router.get('/My-Account', ensureAuthenticated, function (req, res) {
//     res.render('account');
// });


//  process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/users/Dashboard', // redirect to the secure profile section
    failureRedirect: '/users/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// process the signup form
router.post('/join', passport.authenticate('local-signup', {
    successRedirect: '/users/Dashboard', // redirect to the secure profile section
    failureRedirect: '/users/join', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// facebook -------------------------------

// send to facebook to do the authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login'
    }));

// google ---------------------------------

// send to google to do the authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login'
    }));


router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});


// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password_confirmation',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
    function (req, email, password_confirmation, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password_confirmation))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));


// 	// Register User
// router.post('/Join', function (req, res) {
// 	// var FirstName = req.body.FirstName;
// 	// var LastName = req.body.LastName;
// 	var email = req.body.email;

// 	var password = req.body.password;
// 	var password2 = req.body.password2;

// 	// Validation
// 	req.checkBody('FirstName', 'First Name is required').notEmpty();
// 	req.checkBody('LastName', 'Last Name is required').notEmpty();
// 	req.checkBody('email', 'Email is required').notEmpty();
// 	req.checkBody('email', 'Email is not valid').isEmail();	
// 	req.checkBody('password', 'Password is required').notEmpty();
// 	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

// 	var errors = req.validationErrors();

// 	if (errors) {
// 		res.render('join', {
// 			errors: errors
// 		});
// 	}
// 	else {
// 		//checking for email already taken
// 		User.findOne({ email : { 
// 			"$regex": "^" +  email  + "\\b", "$options": "i"
// 	}}, function (err, mail) {
// 			if ( mail) {
// 				res.render('join', {

// 					mail: mail
// 				});
// 			}
// 			else {
// 				 // create the user
//                         var newUser            = new User();

//                         newUser.local.email    = email;
// 						newUser.local.password = newUser.generateHash(password);
// 						// newUser.local.FirstName    = FirstName;
// 						// newUser.local.LastName    = LastName;


// 				User.createUser(newUser, function (err, user) {
// 					if (err) throw err;
// 					console.log(user);
// 				});
// 		 req.flash('success_msg', 'You are registered and can now login');
// 				res.redirect('/users/login');
// 			}
// 	   });
// 	}
// });


// // LOCAL SIGNUP 

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password_confirmation',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},



    function (req, email, password_confirmation, done) {

        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email': email }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser = new User();

                        newUser.local.email = email;
                        newUser.local.password_confirmation = newUser.generateHash(password_confirmation);
                        // newUser.local.FirstName    = FirstName;
                        // newUser.local.LastName    = LastName;


                        newUser.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
                // if the user is logged in but has no local account...
            } else if (!req.user.local.email) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password_confirmation = user.generateHash(password_confirmation);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
var fbStrategy = configAuth.facebookAuth;
fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
passport.use(new FacebookStrategy(fbStrategy,
    function (req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function (err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }
        });

    }));

// GOOGLE ==================================================================
// =========================================================================
passport.use(new GoogleStrategy({

    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

},
    function (req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function (err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }

        });

    }));


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}


module.exports = router;