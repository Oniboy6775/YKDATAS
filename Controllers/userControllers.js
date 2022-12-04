// IMPORTS
const jwt = require("jsonwebtoken");
const randomToken = require("rand-token");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// MODELS
const User = require("../Models/usersModel");
const Data = require("../Models/dataModel");
const Transaction = require("../Models/transactionModel");
const Token = require("../Models/tokenModel");
const cabletvModel = require("../Models/cabletvModel");
// UTILS
const newReferral = require("../Utils/newReferral");
const sendEmail = require("../Utils/sendMail");
const generateAccountNumber = require("../Utils/generateAccountNumber");

// OTHERS
const { cableName } = require("../API_DATA/cableName");
const { disco } = require("../API_DATA/disco");
const { network } = require("../API_DATA/network");
const { TRANSFER_RECEIPT, BONUS_RECEIPT } = require("./TransactionReceipt");
const { MTN_CG, MTN_SME } = require("../API_DATA/newData");

const register = async (req, res) => {
  let { email, password, passwordCheck, userName, referredBy, phoneNumber } =
    req.body;

  // validate

  if (!email || !password || !passwordCheck || !userName || !phoneNumber) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }
  if (password.length < 5)
    return res
      .status(400)
      .json({ msg: "The password needs to be at least 5 characters long." });
  if (password !== passwordCheck)
    return res
      .status(400)
      .json({ msg: "Enter the same password twice for verification." });

  const existingUserEmail = await User.findOne({ email: email });
  if (existingUserEmail)
    return res
      .status(400)
      .json({ msg: "An account with this email already exists." });
  const existingUsername = await User.findOne({ userName: userName });
  if (existingUsername)
    return res.status(400).json({ msg: "This username has been taken" });
  // generate API token for the user
  req.body.apiToken = randomToken.generate(30);
  try {
    await User.create({ ...req.body });
    // generate account number
    await generateAccountNumber({ userName, email });
    const user = await User.findOne({ email });
    const token = user.createJWT();
    const allDataList = await Data.find();
    const MTN_SME_PRICE = allDataList
      .filter((e) => e.plan_network === "MTN")
      .map((e) => {
        const { my_price, id } = e;
        let price = my_price;

        e["plan_amount"] = price;
        return e;
      });

    const GLO_PRICE = allDataList
      .filter((e) => e.plan_network === "GLO")
      .map((e) => {
        const { my_price } = e;
        let price = my_price;

        e["plan_amount"] = price;
        return e;
      });
    const AIRTEL_PRICE = allDataList
      .filter((e) => e.plan_network === "AIRTEL")
      .map((e) => {
        const { my_price } = e;
        let price = my_price;

        e["plan_amount"] = price;
        return e;
      });
    const NMOBILE_PRICE = allDataList
      .filter((e) => e.plan_network === "9MOBILE")
      .map((e) => {
        const { my_price } = e;
        let price = my_price;

        e["plan_amount"] = price;
        return e;
      });
    const CABLETV = await cabletvModel.find({});
    res.status(200).json({
      newUser: user,
      user,
      token,
      transactions: [],
      isAdmin: user._id === process.env.ADMIN_ID ? true : false,
      subscriptionPlans: {
        MTN: MTN_SME_PRICE,
        GLO: GLO_PRICE,
        AIRTEL: AIRTEL_PRICE,
        NMOBILE: NMOBILE_PRICE,
        CABLETV: CABLETV,
        CABLENAME: cableName,
        DISCO: disco,
        NETWORK: network,
      },
    });
    if (referredBy) newReferral(req.body);

    return;
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password)
    return res.status(400).json({ msg: "Not all fields have been entered." });
  let user = await User.findOne({ userName: userName });
  if (!user) user = await User.findOne({ email: userName });
  if (!user)
    return res
      .status(400)
      .json({ msg: "No account with this detail has been registered." });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    return res.status(400).json({ msg: "Incorrect password" });
  // generate account number
  if (!user.reservedAccountNo)
    await generateAccountNumber({
      userName,
      email: user.email,
    });
  const token = user.createJWT();
  const isReseller = user.userType === "reseller";
  const isApiUser = user.userType === "api user";

  const userTransaction = await Transaction.find({ trans_By: user._id })
    .limit(10)
    .sort("-createdAt");
  const allDataList = await Data.find();

  const MTN_SME_PRICE = allDataList
    .filter((e) => e.plan_network === "MTN")
    .map((e) => {
      const { resellerPrice, my_price, id } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });

  const GLO_PRICE = allDataList
    .filter((e) => e.plan_network === "GLO")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const AIRTEL_PRICE = allDataList
    .filter((e) => e.plan_network === "AIRTEL")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const NMOBILE_PRICE = allDataList
    .filter((e) => e.plan_network === "9MOBILE")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const CABLETV = await cabletvModel.find({});
  if (!user.apiToken) {
    const generatedRandomToken = randomToken.generate(30);
    console.log(generatedRandomToken);
    await User.updateOne(
      { email: user.email },
      { $set: { apiToken: generatedRandomToken } },
      { new: true, runValidators: true }
    );
    user.apiToken === generatedRandomToken;
  }

  return res.status(200).json({
    token: token,
    // user: {
    //   userName: user.userName,
    //   fullName: user.userName,
    //   email: user.email,
    //   balance: user.balance,
    //   apiToken: user.apiToken,
    //   reservedAccountNo: user.reservedAccountNo,
    //   reservedAccountBank: user.reservedAccountBank,
    //   reservedAccountNo2: user.reservedAccountNo2,
    //   reservedAccountBank2: user.reservedAccountBank2,
    // },
    user,
    transactions: userTransaction,
    isAdmin: user._id === process.env.ADMIN_ID ? true : false,
    isCouponVendor:
      user._id === process.env.COUPON_VENDOR_FAIZ ||
      user._id === process.env.COUPON_VENDOR_YUSUF
        ? true
        : false,
    subscriptionPlans: {
      MTN: MTN_SME_PRICE,
      GLO: GLO_PRICE,
      AIRTEL: AIRTEL_PRICE,
      NMOBILE: NMOBILE_PRICE,
      CABLETV: CABLETV,
      CABLENAME: cableName,
      DISCO: disco,
      NETWORK: network,
    },
  });
};

const userData = async (req, res) => {
  // return details of the user and purchase objects
  const { userId, userType } = req.user;
  const isReseller = userType === "reseller";
  const isApiUser = userType === "api user";
  let user = await User.findOne({ _id: userId });
  // const data = await Data.find();
  // console.log(data);
  const userTransaction = await Transaction.find({ trans_By: userId })
    .limit(10)
    .sort("-createdAt");
  const allDataList = await Data.find().sort("dataplan_id");
  // const allDataList = MTN_SME;

  const MTN_SME_PRICE = allDataList
    .filter((e) => e.plan_network === "MTN")
    .map((e) => {
      const { resellerPrice, my_price, id } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });

  const GLO_PRICE = allDataList
    .filter((e) => e.plan_network === "GLO")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const AIRTEL_PRICE = allDataList
    .filter((e) => e.plan_network === "AIRTEL")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const NMOBILE_PRICE = allDataList
    .filter((e) => e.plan_network === "9MOBILE")
    .map((e) => {
      const { my_price, resellerPrice } = e;
      let price = my_price;

      if (isReseller || isApiUser) {
        price = resellerPrice;
      }
      e["plan_amount"] = price;
      return e;
    });
  const CABLETV = await cabletvModel.find({});
  if (user.apiToken === undefined) {
    const generatedRandomToken = randomToken.generate(30);
    await User.updateOne(
      { email: user.email },
      { $set: { apiToken: generatedRandomToken } },
      { new: true, runValidators: true }
    );
    user.apiToken === generatedRandomToken;
  }

  res.status(200).json({
    user,
    transactions: userTransaction,
    isAdmin: userId === process.env.ADMIN_ID ? true : false,
    isCouponVendor:
      userId === process.env.COUPON_VENDOR_FAIZ ||
      userId === process.env.COUPON_VENDOR_YUSUF
        ? true
        : false,
    subscriptionPlans: {
      MTN: MTN_SME_PRICE,
      GLO: GLO_PRICE,
      AIRTEL: AIRTEL_PRICE,
      NMOBILE: NMOBILE_PRICE,
      CABLETV: CABLETV,
      CABLENAME: cableName,
      DISCO: disco,
      NETWORK: network,
    },
  });
};

const updateUser = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  if (id !== userId)
    return res
      .status(401)
      .json({ msg: "You are not allowed to update this user" });
  // if (req.body.userType && req.body.userType !== "reseller") {
  const resellerAmount = 1000;
  // console.log(resellerAmount);
  const user = await User.findOne({ _id: userId });
  // console.log(user);
  if (user.userType === req.body.userType)
    return res.status(400).json({ msg: "You are already a reseller" });
  if (user.balance < resellerAmount)
    return res.status(400).json({ msg: "Insufficient balance" });
  // console.log("here");
  await User.updateOne(
    { _id: userId },
    {
      $inc: {
        balance: -resellerAmount,
      },
    }
  );
  const upgradeTransaction = Transaction({
    trans_Id: uuid(),
    trans_By: userId,
    trans_Type: "wallet",
    trans_Network: "upgrade",
    phone_number: `upgrade to ${req.body.userType}`,
    trans_amount: resellerAmount,
    balance_Before: user.balance,
    balance_After: user.balance - resellerAmount,
    trans_Date: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`,
    trans_Status: "success",
    createdAt: Date.now(),
  });

  await upgradeTransaction.save();
  await User.updateOne(
    { _id: userId },
    { ...req.body },
    { runValidators: true }
  );

  res.status(200).json({ msg: "user updated successfully" });
  if (user.referredBy) {
    const referralBonus = 500;
    const referrer = await User.findOne({ userName: user.referredBy });
    if (!referrer) return;
    await BONUS_RECEIPT({ referrer, user, referralBonus });
    await User.updateOne(
      { _id: referrer._id },
      { $inc: { balance: referralBonus } }
    );
  }
  return;
};
const deleteUser = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  if (id !== userId)
    return res
      .status(401)
      .json({ msg: "You are not allowed to delete this user" });
  try {
    await User.findByIdAndDelete(userId);
    res.json({ msg: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const validateToken = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.userId);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestPasswordReset = async (req, res) => {
  // res.status(200).json({ msg: "password reet successful" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Please provide email" });
  const user = await User.findOne({ email: email });

  if (!user)
    return res
      .status(400)
      .json({ msg: "No account with this email has been registered." });
  try {
    let token = await Token.findOne({ userId: user._id });
    if (token)
      return res.status(400).json({
        msg: "You just requested a password reset please check your email or try again later",
      });
    let resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(resetToken, salt);
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.FRONTEND_URL}/passwordReset/${resetToken}/${user._id}`;
    sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.fullName, link: link },
      "../templates/requestResetPassword.handlebars"
    );

    return res.status(200).json({
      msg: "An email has been sent to you. Kindly check your email. Check spam folder if not found",
    });
  } catch (error) {
    console.log(error);
  }
};
const resetPassword = async (req, res) => {
  const { token, userId, newPassword, newPasswordCheck } = req.body;
  if (!newPassword || !newPasswordCheck || !token || !userId)
    return res.status(400).json({ msg: "All fields are required" });
  if (newPassword !== newPasswordCheck)
    return res
      .status(400)
      .json({ msg: "Enter the same password for verification" });
  try {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken)
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid)
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);
    await User.updateOne({ _id: userId }, { $set: { password: hash } });
    const user = await User.findById({ _id: userId });
    sendEmail(
      user.email,
      "Password Reset Successful",
      {
        name: user.fullName,
        link: process.env.FRONTEND_URL,
      },
      "../templates/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return res
      .status(200)
      .json({ msg: "You have successfully reset your password" });
  } catch (error) {
    console.log(error);
  }
};
const requestPinReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Please provide email" });
  const user = await User.findOne({ email: email });

  if (!user)
    return res
      .status(400)
      .json({ msg: "No account with this email has been registered." });
  try {
    let token = await Token.findOne({ userId: user._id });
    // if (token) await token.deleteOne();
    if (token)
      return res.status(400).json({
        msg: "You just requested a pin reset please check your email or try again later",
      });
    let resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(resetToken, salt);
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.FRONTEND_URL}/pinReset/${resetToken}/${user._id}`;
    sendEmail(
      user.email,
      "Transaction Pin Reset Request",
      { name: user.fullName, link: link },
      "../templates/requestResetPin.handlebars"
    );

    return res.status(200).json({
      msg: "An email has been sent to you. Kindly check your email. Check spam folder if not found",
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPin = async (req, res) => {
  const { token, userId, newPin, newPinCheck } = req.body;
  if (!newPin || !newPinCheck || !token || !userId)
    return res.status(400).json({ msg: "All fields are required" });
  if (newPin !== newPinCheck)
    return res
      .status(400)
      .json({ msg: "Enter the same password for verification" });
  try {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken)
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid)
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPin, salt);
    await User.updateOne({ _id: userId }, { $set: { userPin: hash } });
    const user = await User.findById({ _id: userId });
    sendEmail(
      user.email,
      "Transaction pin reset successful",
      {
        name: user.fullName,
        link: process.env.FRONTEND_URL,
      },
      "../templates/pinReset.handlebars"
    );
    await passwordResetToken.deleteOne();
    return res
      .status(200)
      .json({ msg: "You have successfully reset your pin" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occcured" });
  }
};
const transferFund = async (req, res) => {
  // res.status(200).json({msg:"tranfer successful"})
  const { userName, amount, userPin } = req.body;
  const { userId } = req.user;

  const sender = await User.findById(userId);
  const { balance } = sender;
  let receiver = await User.findOne({ userName: userName });
  if (!receiver) receiver = await User.findOne({ email: userName });
  if (!userName || !amount)
    return res.status(400).json({ msg: "All fields are required " });
  if (!receiver)
    return res
      .status(400)
      .json({ msg: "No account with the username provided " });

  if (userId !== process.env.ADMIN_ID)
    return res.status(400).json({ msg: "Only admin can access this route" });
  if (
    amount < 500 &&
    userId !== process.env.ADMIN_ID &&
    userId !== process.env.COUPON_VENDOR_FAIZ &&
    userId !== process.env.COUPON_VENDOR_YUSUF
  )
    return res.status(400).json({ msg: "Minimum transfer is ₦500" });
  if (userName === sender.userName)
    return res.status(400).json({ msg: "You cannot transfer to yourself" });
  if (balance < amount)
    return res
      .status(400)
      .json({ msg: "You cannot transfer more than your balance" });
  try {
    // Transfer transaction

    const senderResponse = await TRANSFER_RECEIPT({
      isSender: true,
      receiver,
      amount,
      balance,
      userId,
    });
    if (senderResponse) {
      // Remove amount from sender balance
      console.log("before");
      await User.updateOne({ _id: userId }, { $inc: { balance: -amount } });
      console.log("after");
    }
    const receiverResponse = await TRANSFER_RECEIPT({
      isSender: false,
      sender,
      amount,
      receiver,
    });
    if (receiverResponse) {
      // add amount to receiver balance
      await User.updateOne(
        { userName: userName },
        { $inc: { balance: amount } }
      );
    }

    return res.status(200).json({
      msg: `You have successfully transfer ₦${amount} to ${userName}`,
      amount: amount,
      receipt: senderResponse,
    });
  } catch (error) {
    // if error return the amount to sender

    return res.status(500).json({ msg: error.message });
  }
};
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, newPasswordCheck } = req.body;
  const user = await User.findById(req.user.userId);
  if (!(oldPassword, newPassword, newPasswordCheck))
    return res.status(400).json({ msg: "All fields are required" });
  if (oldPassword === newPassword)
    return res.status(400).json({
      msg: "You cannot use your old password.Kindly use a new password",
    });
  if (newPassword !== newPasswordCheck)
    return res
      .status(400)
      .json({ msg: "Enter the same password for verification" });

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordMatch)
    return res.status(400).json({ msg: "Your old password is wrong" });
  try {
    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    await User.updateOne(
      { _id: req.user.userId },
      { $set: { password: newPasswordHash } }
    );
    return res.status(200).json({ msg: "Password Changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An error occured" });
  }
};

const validateUser = async (req, res) => {
  try {
    let user = await User.findOne({ userName: req.params.userName });
    if (!user) user = await User.findOne({ email: req.params.userName });
    if (!user) return res.status(404).json({ msg: "user does not exist" });
    return res.status(200).json({ msg: user.email });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  register,
  login,
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
};
