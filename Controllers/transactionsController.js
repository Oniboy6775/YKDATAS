const Transaction = require("../Models/transactionModel");
const Users = require("../Models/usersModel");

const searchTransaction = async (req, res) => {
  const { type, phoneNumber, sort, userName, from, to, status } = req.query;
  const { AGENT_1, AGENT_2, AGENT_3, ADMIN_ID } = process.env;
  const agents = [AGENT_1, AGENT_2, AGENT_3];
  const isAgent = agents.find((e) => e === req.user.userId) === req.user.userId;
  let isAdmin = ADMIN_ID === req.user.userId;

  let queryObject = {};
  if (!isAdmin && !isAgent) {
    queryObject = { trans_By: req.user.userId };
  }
  // type of transaction
  if (type && type !== "all") {
    queryObject.trans_Type = type;
  }
  // filter with phone number
  if (phoneNumber) {
    queryObject.phone_number = { $regex: phoneNumber, $options: "i" };
  }
  let userId;
  // filter with username
  if (userName) {
    let user = await Users.findOne({
      userName: { $regex: userName, $options: "i" },
    });
    if (user) {
      userId = user._id;
    }
  }
  // filter with transaction status
  if (status && status !== "all") {
    queryObject.trans_Status = status;
  }
  //  filter with userId
  if (userName && userId) {
    queryObject.trans_By = userId;
  }
  if (from) {
    queryObject.createdAt = { $gte: from, $lt: to || new Date() };
  }

  let result = Transaction.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  // Fetch transactions for the selected day to calculate no of GB sold

  let start = from ? from : new Date().setHours(0, 0, 0, 0);
  let end = to ? to : new Date().setHours(23, 59, 59, 999);
  let query = {
    createdAt: { $gte: start, $lt: end },
  };
  if (!isAdmin && !isAgent) {
    query.trans_By = req.user.userId;
  }
  if (userName) {
    query.trans_By = userId;
  }
  // Calculating total GB purchased
  const today = await Transactions.find(query);
  const totalSales = today.reduce((acc, cur) => {
    acc += cur.trans_volume_ratio;
    return acc;
  }, 0);
  // Calculating profit for selected transactions
  const totalProfit = today.reduce((acc, cur) => {
    const currentProfit = isNaN(cur.trans_profit) ? 0 : cur.trans_profit;
    acc += currentProfit;
    return acc;
  }, 0);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  result = await result.skip(skip).limit(limit);
  let noOfTransaction = await Transaction.countDocuments(queryObject);
  const totalPages = Math.ceil(noOfTransaction / limit);
  res
    .status(200)
    .json({ transactions: result, totalPages, totalSales, totalProfit });
};
module.exports = searchTransaction;
