const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
const generateToken = (payload) => {
    try {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'library-duty-system',
            audience: 'library-users'
        });
    } catch (error) {
        console.error('Error generating token:', error.message);
        throw new Error('Token generation failed');
    }
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'library-duty-system',
            audience: 'library-users'
        });
    } catch (error) {
        console.error('Error verifying token:', error.message);
        throw new Error('Token verification failed');
    }
};

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Access token required'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: true,
            message: 'Invalid or expired token'
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken
};