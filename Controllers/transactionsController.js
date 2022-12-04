const Transaction = require("../Models/transactionModel");
const Users = require("../Models/usersModel");

const searchTransaction = async (req, res) => {
  const { type, phoneNumber, sort, userName } = req.query;
  let isAdmin = process.env.ADMIN_ID === req.user.userId;

  let queryObject = {};
  if (!isAdmin) {
    queryObject = { trans_By: req.user.userId };
  }
  if (type && type !== "all") {
    queryObject.trans_Type = type;
  }
  if (phoneNumber) {
    queryObject.phone_number = { $regex: phoneNumber, $options: "i" };
  }
  let userId;
  if (userName) {
    let user = await Users.findOne({
      userName: { $regex: userName, $options: "i" },
    });

    if (user) {
      // console.log(user);
      userId = user._id;
    }
  }
  if (userName && userId) {
    queryObject.trans_By = userId;
  }

  // console.log(queryObject);
  let result = Transaction.find(queryObject);
  // console.log(result);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = await result.skip(skip).limit(limit);
  const transactions = await result;
  let noOfTransaction = await Transaction.countDocuments(queryObject);
  const totalPages = Math.ceil(noOfTransaction / limit);
  res.status(200).json({ transactions: result, totalPages });
};
module.exports = searchTransaction;
