const jwt = require("jsonwebtoken");
const CustomError = require("../utility/customErrorClass");
// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        const err = new CustomError("Unauthorized User", 401);
        throw err;
    }

    jwt.verify(token, "secretKey", (err, user) => {
        if (err) {
            const err = new CustomError("Forbidden", 403);
            throw err;
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
