const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY; // Ensure this matches the key used to sign the token

// Middleware to check the token
const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) {
        return res.status(401).send('Access denied, no token provided');
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid or expired token');
        }
        req.user = decoded; // Store the decoded user info for use in other routes
        next();
    });
};

module.exports = authenticateUser;