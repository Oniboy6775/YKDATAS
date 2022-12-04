const axios = require("axios");

const BUYDATA = async ({ network, mobile_number, plan }) => {
  try {
    const BuyDataResponse = await axios.post(
      `${process.env.DATARELOADED_API}/buy/data`,
      {
        network: network,
        mobile_number: mobile_number,
        plan: plan,
      },
      {
        headers: {
          Authorization: process.env.DATARELOADED_API_KEY,
        },
      }
    );
    return {
      status: true,
      msg: "Airtime purchase successful",
      data: BuyDataResponse.data.receipt,
    };
  } catch (error) {
    return { status: false };
  }
};
module.exports = BUYDATA;
