const User = require("../Models/usersModel");
const { AIRTIME_RECEIPT, DATA_RECEIPT } = require("./TransactionReceipt");
const Data = require("../Models/dataModel");
const generateReceipt = require("./generateReceipt");
const CostPrice = require("../Models/costPriceModel");
const { v4: uuid } = require("uuid");

const BUYAIRTIME = require("./APICALLS/Airtime/buyAirtime");
const BUYDATA = require("./APICALLS/Data/Data");
const buyAirtime = async (req, res) => {
  const {
    user: { userId, userType },
    body: { mobile_number, amount, network },
  } = req;
  const isReseller = userType === "reseller";
  const isApiUser = userType === "api user";
  let amountToCharge = amount * 0.98;
  if (isReseller || isApiUser) amountToCharge = amount * 0.975;
  const user = await User.findById(userId);
  if (!mobile_number || !amount || !network)
    return res.status(400).json({ msg: "All fields are required" });
  if (amount < 100)
    return res.status(400).json({ msg: "Minimum purchase is 100" });
  const { balance } = user;
  if (balance < amountToCharge || balance - amountToCharge < 0)
    return res
      .status(400)
      .json({ msg: "Insufficient balance. Kindly fund your wallet" });
  await User.updateOne({ _id: userId }, { $inc: { balance: -amountToCharge } });
  const { status, msg } = await BUYAIRTIME({ network, amount, mobile_number });
  let NETWORK = "";
  if (network == "1") NETWORK = "MTN";
  if (network == "2") NETWORK = "GLO";
  if (network == "3") NETWORK = "AIRTEL";
  if (network == "4") NETWORK = "9MOBILE";
  if (status) {
    const receipt = await AIRTIME_RECEIPT({
      plan_network: NETWORK,
      Status: "success",
      plan_amount: amount,
      mobile_number,
      amountToCharge,
      balance,
      userId,
    });
    res.status(200).json({ msg: msg, receipt });
  } else {
    await User.updateOne(
      { _id: userId },
      { $inc: { balance: +amountToCharge } }
    );
    return res.status(500).json({
      msg: msg || "Transaction failed",
    });
  }
};
const buyData = async (req, res) => {
  const {
    user: { userId, userType },
    body: { plan, mobile_number, network },
  } = req;
  const isReseller = userType === "reseller";
  const isApiUser = userType === "api user";
  if (!plan || !mobile_number || !network)
    return res.status(400).json({ msg: "All fields are required" });
  const user = await User.findOne({ _id: userId });
  const { balance } = user;
  const dataTobuy = await Data.findOne({ dataplan_id: plan });
  if (!dataTobuy)
    return res.status(400).json({ msg: "This data is not available" });
  const {
    resellerPrice,
    plan_type,
    my_price,
    plan: dataVolume,
    volumeRatio,
  } = dataTobuy;

  let amountToCharge = my_price;
  if (isReseller || isApiUser) amountToCharge = resellerPrice || my_price;
  if (balance < amountToCharge || balance - amountToCharge < 0)
    return res
      .status(400)
      .json({ msg: "Insufficient balance. Kindly fund your wallet" });
  await User.updateOne({ _id: userId }, { $inc: { balance: -amountToCharge } });
  let message;
  let receipt = {};
  let isSuccess = false;

  let NETWORK = "";
  if (network == "1") NETWORK = "MTN";
  if (network == "2") NETWORK = "GLO";
  if (network == "3") NETWORK = "AIRTEL";
  if (network == "6") NETWORK = "9MOBILE";
  // Checking the cost price of the data
  let { costPrice } = await CostPrice.findOne({ network: NETWORK });
  if (NETWORK === "MTN" && plan_type == "CG") {
    const { costPrice: CG_COST_PRICE } = await CostPrice.findOne({
      network: "MTN-CG",
    });
    costPrice = CG_COST_PRICE;
  }
  const { status, data, msg } = await BUYDATA({ ...req.body });

  isSuccess = status;
  if (status) {
    console.log({ ...data });
    receipt = await generateReceipt({
      // ...data,
      // amountToCharge,
      // userId,
      // mobile_number,
      // balance,
      // userName: user.userName,
      // type: "data",
      // costPrice,
      transactionId: uuid(),
      planNetwork: NETWORK,
      planName: `${plan_type} ${dataVolume}`,
      phoneNumber: mobile_number,
      status: "success",
      amountToCharge,
      balance,
      userId,
      userName: user.userName,
      type: "data",
      volumeRatio: volumeRatio,
      costPrice,
      ...data,
    });
  }
  if (isSuccess) {
    res.status(200).json({ msg, receipt });
  } else {
    await User.updateOne(
      { _id: userId },
      { $inc: { balance: +amountToCharge } }
    );
    return res.status(500).json({
      msg: msg || "Transaction failed",
    });
  }
};

const validateMeter = async (req, res) => {
  res.status(500).json({
    msg: "An error occur.Please try again later",
  });
};

const validateCableTv = async (req, res) => {
  res.status(500).json({
    msg: "An error occur.Please try again later",
  });
};

const buyElectricity = async (req, res) => {
  res.status(500).json({
    msg: "An error occured.Please try again later",
  });
};
const buyCableTv = async (req, res) => {
  return res.status(400).json({ msg: "Not available at the moment" });
};
module.exports = {
  buyAirtime,
  buyData,
  buyElectricity,
  buyCableTv,
  validateCableTv,
  validateMeter,
};
