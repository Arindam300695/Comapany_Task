const express = require("express"); // requiring express package;
const cors = require("cors"); // requiring cors package;
require("dotenv").config(); // requiring dotenv package;
const errorHandler = require("./middlewares/errorHandler"); // requiring global errorHandler function;
const dbConnection = require("./utility/dbConnection"); // requiring dbconnection function;
const authRoute = require("./routes/authRoutes");
const CustomError = require("./utility/customErrorClass"); // requiring CustomError class;
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const authenticateJWT = require("./middlewares/jwtTokenVerificationController");

// initializing express app
const app = express();
// using express middlewares
app.use(
    express.json({
        inflate: true, // Allow automatic decompression of compressed data
        limit: "100mb",
        type: "application/json",
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "100mb",
        parameterLimit: 10000,
        type: ["application/x-www-form-urlencoded", "multipart/form-data"], // Parse both URL-encoded and multipart form data
    })
);
app.use(
    cors({
        origin: true, // to allow all the origins
        credentials: true, // to send credentials (like cookies or HTTP authentication) along with the requests,
    })
);
app.use(cookieParser());
// Session middleware
// app.use(
//     session({
//         secret: "your-secret-key", // Change this to a strong secret key
//         resave: false,
//         saveUninitialized: true,
//     })
// );

// listening to the server
app.listen(4000, async (err) => {
    if (!err) {
        console.log("server is running at port 4000");
        await dbConnection();
    }
    if (err) throw new CustomError(408, "request time out! 😥");
});

// requiring all the necessary routes;
app.use("/api/auth", authRoute);

// home route which is protected and can be accessed only after successfull login
app.get("/", authenticateJWT, (req, res, next) => {
    if (!req.user) {
        const err = new CustomError(
            "this route is protected and cannot be accessed without being logged in! 🫠"
        );
    }
    if (req.user)
        return res.json({ user: req.user, message: "loged in successfull" });
});

// handleing the route which doesnot exist but user wants to access;
app.get("*", (req, res, next) => {
    const url = req.originalUrl;

    const err = new CustomError(`Cannotyt find the requested ${url}`, 404);
    throw err;
});

// global error handler
app.use(errorHandler);
