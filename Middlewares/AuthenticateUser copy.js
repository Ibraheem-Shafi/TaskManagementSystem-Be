const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY; // Ensure this is properly set in your environment

// Middleware to check the token from httpOnly cookies
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Safely access the token from cookies

    console.log(token)
    const decodedToken = jwt.decode(token);
    console.log(decodedToken);

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach decoded token payload to the request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateUser;
