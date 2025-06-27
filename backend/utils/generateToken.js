const jwt = require('jsonwebtoken');

const generateToken = ( res,user) => {

    if (!user || !user._id) {
        throw new Error("User object is missing or does not have an _id");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },  // Convert _id to string
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    );

    // Different cookie settings for development vs production
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
        // For render.com cross-origin requests
        ...(isProduction && {
            domain: process.env.COOKIE_DOMAIN || undefined
        })
    };

    res.cookie("token", token, cookieOptions);

    return token;
};

module.exports =  generateToken ;
