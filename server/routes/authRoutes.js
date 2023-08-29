const {
    signupController,
    loginController,
    logoutController,
    walletBalanceUpdateController,
    findUserController,
} = require("../controller/authController");
const authenticateJWT = require("../middlewares/jwtTokenVerificationController");

const authRoute = require("express").Router();

authRoute.post("/signup", signupController);
authRoute.post("/login", loginController);
authRoute.get("/logout", logoutController);
authRoute.get("/findUserData", authenticateJWT, findUserController);
authRoute.patch(
    "/updateWalletBalance",
    authenticateJWT,
    walletBalanceUpdateController
);

module.exports = authRoute;
