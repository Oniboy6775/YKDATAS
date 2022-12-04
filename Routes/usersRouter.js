const express = require("express");
const {
  login,
  register,
  updateUser,
  deleteUser,
  validateToken,
  userData,
  requestPasswordReset,
  resetPassword,
  requestPinReset,
  resetPin,
  transferFund,
  changePassword,
  validateUser,
} = require("../Controllers/userControllers");
const auth = require("../Middleware/auth");
const router = express.Router();

router.get("/", auth, userData);
router.post("/login", login);
router.post("/register", register);
router.route("/:id").patch(auth, updateUser).delete(auth, deleteUser);
router.post("/requestPasswordReset", requestPasswordReset);
router.post("/resetpassword", resetPassword);
router.post("/requestPinReset", auth, requestPinReset);
router.post("/resetpin", resetPin);
router.post("/istokenValid", validateToken);
router.post("/transferFund", auth, transferFund);
router.post("/changePassword", auth, changePassword);
router.get("/validateUser/:userName", auth, validateUser);

module.exports = router;
