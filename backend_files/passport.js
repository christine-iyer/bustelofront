// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || 'https://franky-app-ix96j.ondigitalocean.app';

// Validate required environment variables
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('⚠️  WARNING: Google OAuth credentials are missing!');
  console.error('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Set' : 'MISSING');
  console.error('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'Set' : 'MISSING');
  console.error('Google OAuth will not work until these are configured.');
} else {
  console.log('✓ Google OAuth credentials configured');
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/user/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google Profile:', profile);

          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log('Existing user found:', user);
            return done(null, user);
          }

          // Check if email already exists (from manual signup)
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              // Link Google account to existing user
              user.googleId = profile.id;
              user.avatar = profile.photos?.[0]?.value;
              await user.save();
              console.log('Linked Google to existing user:', user);
              return done(null, user);
            }
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || `user_${Date.now()}`,
            email: email,
            avatar: profile.photos?.[0]?.value,
          });

          console.log('New user created:', user);
          return done(null, user);
        } catch (error) {
          console.error('Passport Google Strategy Error:', error);
          return done(error, undefined);
        }
      }
    )
  );

  // Serialize user for session (optional if using JWT)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = passport;