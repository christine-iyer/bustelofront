const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/user.js');
const passport = require('../../config/passport');
const { generateToken } = require('../../utils/jwt');
const User = require('../../models/user'); // ADD THIS

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://book-app-front-lake.vercel.app';

// ========== AUTHENTICATION ROUTES ==========
// @route   POST /api/user/signup
// @desc    Create new user account
router.post('/signup', userController.signUp);

// @route   POST /api/user/login
// @desc    Login with email and password
router.post('/login', userController.login);

// @route   POST /api/user/logout
// @desc    Logout (client removes token)
router.post('/logout', userController.logout);

// ========== USER CRUD ROUTES ==========
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUser);
router.get('/', userController.listUsers);

// ========== GOOGLE OAUTH ROUTES ==========
// @route   GET /api/user/auth/google
// @desc    Initiate Google OAuth
router.get('/auth/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

// @route   GET /api/user/auth/google/callback
// @desc    Google redirects here after user logs in
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/Callback?error=auth_failed` }),
  async (req, res) => {
    try {
      // req.user is set by passport after successful authentication
      const user = req.user;
      
      if (!user) {
        return res.redirect(`${FRONTEND_URL}/Callback?error=no_user`);
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      console.log('Google auth successful, redirecting with token');
      
      // Redirect to frontend with token
      res.redirect(`${FRONTEND_URL}/Callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${FRONTEND_URL}/Callback?error=auth_failed`);
    }
  }
);

// @route   GET /api/user/me
// @desc    Get current user from token
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { verifyToken } = require('../../utils/jwt');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // The decoded token should have the user id
    // Check your jwt.js to see what field name is used (id, userId, _id, etc.)
    const userId = decoded.id || decoded.userId || decoded._id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data in the format your frontend expects
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      googleId: user.googleId
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;