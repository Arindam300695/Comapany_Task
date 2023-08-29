const mongoose = require("mongoose");
const CustomError = require("../utility/customErrorClass");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name should be at least 2 characters"],
        maxlength: [30, "First name should not exceed 30 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name should be at least 2 characters"],
        maxlength: [30, "Last name should not exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                    value
                );
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    topup: {
        type: Number,
        default: 0,
    },
});

// Pre-save middleware to hash password and check password length
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            // before saving the user data in the database we are checking if the password length is at least of 8 charecters or not
            if (this.password.length < 8) {
                const error = new CustomError(
                    "Password should be at least 3 characters"
                );
                error.statusCode = 400;
                return next(error);
            }
            // we are also checking that the password length should not exceeded 15 charecters
            if (this.password.length > 15) {
                const error = new CustomError(
                    "Password should not exceed 15 characters"
                );
                error.statusCode = 400;
                return next(error);
            }
            // if everything is fine then we are hashing the password so that it will get hard for the hackers to decode the password if in future the database will get hacked by the hackers.
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
