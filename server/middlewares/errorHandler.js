const CustomError = require("../utility/customErrorClass");

module.exports = (err, req, res, next) => {
    // Default status code and error message for unhandled errors
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let status = err.status;
    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        errorMessage = err.message;
    }

    // logging the error details
    console.log("status code : ", statusCode);
    console.log("error message : ", errorMessage);
    console.log("error status : ", err.status);
    console.log(err.name);

    // Send the error response
    return res.status(statusCode).json({ status, error: errorMessage });
};
