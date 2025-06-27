const jwt = require('jsonwebtoken');

const generateToken = ( res,user) => {

    if (!user || !user._id) {
        throw new Error("User object is missing or does not have an _id");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },  // Convert _id to string
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("token", token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });

    return token;
};

module.exports =  generateToken ;
