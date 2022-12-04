const axios = require("axios");
const Services = require("../../../Models/services");

const buyElectricity = async ({
  meterId,
  amount,
  meterNumber,
  address,
  meterOwner,
  meterType,
}) => {
  let serviceId = "10";
  let message;
  const { serviceStatus, serviceName } = await Services.findOne({ serviceId });
  if (!serviceStatus) {
    message = `${serviceName} is not available at the moment`;
    return { status: false, msg: message };
  }
  try {
    const BuyDataResponse = await axios.post(
      `${process.env.GLADITINGSDATA_API}/billpayment/`,
      {
        Customer_Phone: "08108126121",
        MeterType: meterType,
        amount,
        customer_address: address,
        customer_name: meterOwner,
        disco_name: meterId,
        meter_number: meterNumber,
      },
      {
        headers: {
          Authorization: process.env.GLADITINGSDATA_TOKEN,
        },
      }
    );
    if (BuyDataResponse.data.Status === "failed")
      return { status: false, msg: "Transaction failed" };
    return {
      status: true,
      token: BuyDataResponse.data.token,
      msg: "Electricity token purchase successful",
    };
  } catch (error) {
    return { status: false, msg: "Transaction failed" };
  }
};
module.exports = buyElectricity;
