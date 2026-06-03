const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google strategy called with profile ID:', profile.id);
  console.log('Google strategy - clientID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('Google strategy - clientSecret exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('Google strategy - callbackURL:', process.env.GOOGLE_CALLBACK_URL);
  console.log('Google strategy - profile:', profile.id);
  console.log('Google strategy - email:', profile.emails[0].value);
  
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    console.log('Creating new user...');
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
    });
    console.log('New user created:', user._id);
  } else {
    console.log('Existing user found:', user._id);
  }
  return done(null, user);
}));

// Session serialization for OAuth flow
passport.serializeUser((user, done) => {
  console.log('Serializing user for OAuth:', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Deserializing user for OAuth:', id);
  User.findById(id)
    .then(user => {
      console.log('Deserialized user found:', user ? user._id : 'null');
      done(null, user);
    })
    .catch(err => {
      console.error('Deserialization error:', err);
      done(err, null);
    });
});
