import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    // Log request details for debugging
    console.log("Auth request:", {
      cookies: req.cookies,
      headers: req.headers,
      path: req.path
    });

    if (!token) {
      console.log("No token found in cookies");
      return res
        .status(401)
        .json({ 
          message: "Authentication required. Please log in.", 
          success: false 
        });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Token verification failed");
      return res.status(401).json({ 
        message: "Invalid or expired token. Please log in again.", 
        success: false 
      });
    }

    req.id = decoded.UserId;
    next();
  } catch (error) {
    console.error("Authentication error:", {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(401).json({ 
      message: "Authentication failed. Please log in again.", 
      success: false,
      error: error.message 
    });
  }
};

export default isAuthenticated;