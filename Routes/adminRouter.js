const express = require("express");
const auth = require("../Middleware/auth");
const router = express.Router();
const {
  adminDetails,
  generateCoupon,
  sendMail,
  refund,
  updateAvailableServices,
  searchUsers,
  updatePrice,
} = require("../Controllers/adminController");

router.get("/", auth, adminDetails);
router.get("/users", auth, searchUsers);
router.post("/generateCoupon", auth, generateCoupon);
router.post("/sendMail", auth, sendMail);
router.post("/updateServices", auth, updateAvailableServices);
router.post("/updatePrice", auth, updatePrice);
router.post("/sendMail/:id", auth, sendMail);
router.post("/refund/:id", auth, refund);
module.exports = router;
