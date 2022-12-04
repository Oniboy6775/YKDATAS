const axios = require("axios");
const Services = require("../../../Models/services");

const buyAirtime = async ({ network, mobile_number, amount }) => {
  let networkId = "";
  let message = "";
  const availableNetworks = {
    1: { id: 3, name: "AIRTEL" }, //AIRTEL
    2: { id: 1, name: "MTN" }, //MTN
    3: { id: 2, name: "GLO" }, //GLO
    4: { id: 6, name: "9MOBILE" }, //9MOBILE
  };
  const isPlanExist = availableNetworks.hasOwnProperty(network);
  if (!isPlanExist) return { status: false, msg: "Invalid plan Id" };
  networkId = availableNetworks[network];
  let serviceId = networkId.id; //ALL NETWORK ID IN DATABASE
  if (networkId.id == 6) serviceId = 4; //ONLY 9MOBILE
  // const { serviceStatus, serviceName } = await Services.findOne({ serviceId });
  // if (!serviceStatus) {
  //   message = `${serviceName} is not available at the moment`;
  //   return { status: false, msg: message };
  // }
  try {
    await axios.post(
      `${process.env.DATARELOADED_API}/buy/airtime`,
      {
        network: networkId.id,
        mobile_number: mobile_number,
        amount: amount,
      },
      {
        headers: {
          Authorization: process.env.DATARELOADED_API_KEY,
        },
      }
    );
    return { status: true, msg: "Airtime purchase successful" };
  } catch (error) {
    return { status: false };
  }
};
module.exports = buyAirtime;
