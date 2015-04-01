var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
         //   if (profile._json.hd === "morris.umn.edu") {
                User.findOne({
                    'google.id': profile.id
                }, function (err, user) {
                    if (!user) {
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            role: 'user',
                            username: profile.username,
                            provider: 'google',
                            google: profile._json
                        });
                        user.save(function (err) {
                            if (err) done(err);
                            return done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
        //    } else {
                //$location.path('/login');
        //        done("Please go back a page to log in again with your UMM X-500. If using the Google+ button please go to your google account and log in with your X-500. You will need to go to Google to logout.");
       //     }
        }
    ));
};
