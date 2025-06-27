const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.token;
        
        // If no cookie token, check Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }
        
        // If token is not found in either place
        if (!token) {
            console.log('No token found in cookies or Authorization header');
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        // Verify the token using the secret key
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the user ID to the request object
        req.user = decode.userId;

        // Proceed to the next middleware/handler
        next();
    } catch (error) {
        // Handle invalid or expired token
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Handle unexpected errors
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { isAuthenticated };
