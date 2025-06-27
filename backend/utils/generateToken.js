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
        // For cross-origin on render.com, try setting domain to the TLD
        ...(isProduction && {
            domain: '.onrender.com'
        })
    };

    console.log('=== COOKIE GENERATION DEBUG ===');
    console.log('isProduction:', isProduction);
    console.log('cookieOptions:', cookieOptions);
    console.log('Setting cookie with name: token');
    console.log('================================');

    res.cookie("token", token, cookieOptions);
    
    console.log('Cookie set successfully. Response headers:', res.getHeaders());
    console.log('=== END COOKIE DEBUG ===');

    return token;
};

module.exports =  generateToken ;
