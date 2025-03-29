const jwt = require("jsonwebtoken");

// Middleware to verify JWT token and attach user data to request
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Remove "Bearer " prefix if present
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : authHeader;

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = verified;
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;