import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "unauthorized - no token provided" 
        });
    }
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ 
                success: false, 
                message: "unauthorized - invalid token" 
            });
        }
        
        req.userId = decode.userId;
        req.user = { userId: decode.userId };
        next();
    } catch (error) {
        console.log("Error in verifying token:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};