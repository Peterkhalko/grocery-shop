const mongoose = require("mongoose");
const ping = require("ping");
const establishConnection = {
  connect: ()=>{
    try {
       //below is the process to intregate cloud version of atlas mongo instance
    // const cloudURL = config.mongodb.cloud.url; // Not implemented yet
    const cloudURL = "test";
    const localURL = "mongodb://localhost:27017/qp";

    const isCloudServerAvailable = async () => {
      try {
        const res = await ping.promise.probe(cloudURL);
        return res.alive;
      } catch (error) {
        console.error("Error pinging the cloud server:", error.message);
        return false;
      }
    };

    const connectToMongo = async () => {
      const useCloudServer = await isCloudServerAvailable();
      console.log(cloudURL);
      // Choose the appropriate MongoDB URL based on availability
      const mongoURL = useCloudServer ? cloudURL : localURL;

      mongoose.connect(mongoURL, {});

      const db = mongoose.connection;

      db.on("error", console.error.bind(console, "MongoDB connection error:"));
      db.once("open", () => {
        console.log(
          `Connected to MongoDB using ${mongoURL}: -  ${
            useCloudServer ? "cloud server" : "localhost"
          }`
        );
      });
    };

    const connectToMongoDevelopment = async () => {
      mongoose.connect(localURL, {});

      const db = mongoose.connection;

      db.on("error", console.error.bind(console, "MongoDB connection error:"));
      db.once("open", () => {
        console.log(
          `Connected to MongoDB using ${localURL}: -  : 'localhost'}`
        );
      });
    };

    // connectToMongo();
    connectToMongoDevelopment();
      
    } catch (error) {
      console.log("-----------------------------");
      throw error;
    }
   
  }
};

module.exports = establishConnection;
