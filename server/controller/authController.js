const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel"); // Your User model
const CustomError = require("../utility/customErrorClass");
const jwt = require("jsonwebtoken");

// signupController
module.exports.signupController = asyncErrorHandler(async (req, res, next) => {
    const formData = req.body;
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const email = formData.email;
    const password = formData.password;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const err = new CustomError(
            "User already exists with the provided mail id! 😞",
            405
        );
        throw err;
    }

    // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        firstName,
        lastName,
        email,
        // password: hashedPassword,
        password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
});

//loginController
module.exports.loginController = asyncErrorHandler(async (req, res, next) => {
    const formData = req.body;
    const userEmail = formData.email;
    const password = formData.password;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        const err = new CustomError(
            "Invalid credentials, user not exist with this given mail id, 😅",
            401
        );
        throw err;
    }

    // If the user exists, send the desired fields as a response
    const { firstName, lastName, email, topup } = user;

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const err = new CustomError(
            "Invalid credentials, password is not valid for this user! 😅",
            401
        );
        throw err;
    }

    // Generate JWT
    const token = jwt.sign({ firstName, lastName, email, topup }, "secretKey");

    // Set JWT as a cookie
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }).redirect("/");
});

// logoutController
module.exports.logoutController = asyncErrorHandler(async (req, res, next) => {
    res.clearCookie("token");
    return res.send("Logged out successfully! 🥰");
});

// wallet balance update controller
module.exports.walletBalanceUpdateController = asyncErrorHandler(
    async (req, res, next) => {
        const { inputValue } = req.body;
        const converTedInput = parseInt(inputValue);

        const user = req.user;
        const newUserData = await User.findOne({ email: user.email });
        newUserData.topup += converTedInput;
        await newUserData.save();
        return res.send({
            newUserData,
            message: "welcome to the wallet balance update controller! 🥰",
        });
    }
);

// findSpecificUser controller
module.exports.findUserController = asyncErrorHandler(
    async (req, res, next) => {
        const user = req.user;
        const userData = await User.findOne({ email: user.email });
        return res.json({ userData });
    }
);
