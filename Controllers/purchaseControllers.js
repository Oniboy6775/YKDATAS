const User = require("../Models/usersModel");
const {
  AIRTIME_RECEIPT,
  DATA_RECEIPT,
  ELECETRICITY_RECEIPT,
} = require("./TransactionReceipt");
const Data = require("../Models/dataModel");
const { disco } = require("../API_DATA/disco");

const axios = require("axios");
const BUYAIRTIME = require("./APICALLS/Airtime/buyAirtime");
const BUYELECTRICITY = require("./APICALLS/Electricity/buyElectricity");
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
  if (network == "1") NETWORK = "AIRTEL";
  if (network == "2") NETWORK = "MTN";
  if (network == "3") NETWORK = "GLO";
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
    month_validate,
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

  const { status, data, msg } = await BUYDATA({ ...req.body });
  message = msg;
  isSuccess = status;
  if (status) {
    receipt = await DATA_RECEIPT({
      ...data,
      amountToCharge,
      userId,
      mobile_number,
      balance,
    });
  }
  if (isSuccess) {
    res.status(200).json({ msg: message, receipt });
  } else {
    await User.updateOne(
      { _id: userId },
      { $inc: { balance: +amountToCharge } }
    );
    return res.status(500).json({
      msg: message || "Transaction failed",
    });
  }
};

const validateMeter = async (req, res) => {
  const { meterNumber, meterId, meterType } = req.body;
  if (!meterNumber && !meterId)
    return res.status(400).json({ msg: "All fields are required" });
  const meterIdObj = disco.find((e) => e.id == meterId);
  if (!meterIdObj) return res.status(400).json({ msg: "Invalid meter ID" });
  const { id, name } = meterIdObj;
  // console.log(req.body);
  try {
    const ValidateMeterResponse = await axios.get(
      `https://www.gladtidingsdata.com/ajax/validate_meter_number/?meternumber=${meterNumber}&disconame=${name}&mtype=${meterType.toUpperCase()}`,
      {
        headers: {
          Authorization: process.env.GLADITINGSDATA_TOKEN,
        },
      }
    );
    if (ValidateMeterResponse.data.invalid) {
      return res.status(400).json(ValidateMeterResponse.data);
    }
    return res.status(200).json(ValidateMeterResponse.data);
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      msg: "Unable to validate meter",
    });
  }
};

const validateCableTv = async (req, res) => {
  const { smart_card_number, cablename } = req.body;
  if (!smart_card_number && !cablename)
    return res.status(400).json({ msg: "All feilds are required" });
  try {
    const ValidateIUCResponse = await axios.get(
      `https://www.gladtidingsdata.com/ajax/validate_iuc/?smart_card_number=${smart_card_number}&cablename=${cablename}`
    );

    return res.status(200).json(ValidateIUCResponse.data);
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      msg: "An error occured.Please try again later",
    });
  }
};

const buyElectricity = async (req, res) => {
  const { meterId, meterNumber, amount, meterType } = req.body;
  const { userId, userType } = req.user;
  const amountToCharge = parseFloat(amount) + 50;
  if (!meterId || !meterNumber || !amount || !meterType)
    return res.status(400).json({ msg: "All feilds are required" });
  const user = await User.findById(userId);
  const { balance } = user;

  if (amount < 1000)
    return res.status(400).json({ msg: "minimum purchase is 1000" });
  if (balance < amountToCharge || balance - amountToCharge < 0)
    return res
      .status(400)
      .json({ msg: "Insufficient balance. Kindly fund your wallet" });
  // Charging the user
  await User.updateOne({ _id: userId }, { $inc: { balance: -amountToCharge } });

  const response = await BUYELECTRICITY({ ...req.body });
  const { status, token, msg } = response;
  if (status) {
    const receipt = await ELECETRICITY_RECEIPT({
      package: "electricity token",
      Status: "success",
      token: token,
      meter_number: meterNumber,
      amountToCharge,
      balance,
      userId,
    });
    res.status(200).json({ msg: msg, receipt });
  } else {
    // return the charged amount
    await User.updateOne(
      { _id: userId },
      { $inc: { balance: amountToCharge } }
    );
    res.status(500).json({ msg: msg || "Transaction failed" });
  }
};
const buyCableTv = async (req, res) => {
  return res.status(400).json({ msg: "Not available at the moment" });
  res.send("buy cabletv");
};
module.exports = {
  buyAirtime,
  buyData,
  buyElectricity,
  buyCableTv,
  validateCableTv,
  validateMeter,
};
