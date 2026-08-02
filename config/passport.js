const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connectDB = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = await connectDB();
      const users = db.collection('users');

      let user = await users.findOne({ googleId: profile.id });

      if (!user) {
        const result = await users.insertOne({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });
        user = { _id: result.insertedId, googleId: profile.id, name: profile.displayName, email: profile.emails[0].value };
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const { ObjectId } = require('mongodb');
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;