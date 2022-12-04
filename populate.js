const mongoose = require("mongoose");
const cabletvModel = require("./Models/cabletvModel");
const dataModel = require("./Models/dataModel");
const services = require("./Models/services");
const { GOTV, DSTV, STARTIME } = require("./API_DATA/cabletv");
const {
  MTN_SME,
  GLO,
  AIRTEL,
  NMOBILE,
  SERVICES,
} = require("./API_DATA/newData");
require("dotenv").config();
const populate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
    await dataModel.deleteMany({});
    await dataModel.create(MTN_SME);
    await dataModel.create(GLO);
    await dataModel.create(AIRTEL);
    await dataModel.create(NMOBILE);
    await cabletvModel.create(GOTV);
    await cabletvModel.create(DSTV);
    await cabletvModel.create(STARTIME);
    // await services.create(SERVICES);

    console.log("Success!!");
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

populate();
