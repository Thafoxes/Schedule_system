const express = require('express');
const { register, login, getProfile, updateProfile, updatePassword } = require('../controllers/authentication');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/password', authenticateToken, updatePassword);


// Test route to verify auth is working
router.get('/test-auth', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication working!',
        user: req.user
    });
});

module.exports = router;