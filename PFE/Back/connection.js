require("dotenv").config();

const mongoose = require("mongoose");

const connectionStr = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.fvtr4c4.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionStr, { useNewUrlparser: true })
  .then(() => console.log("connected to Database"))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log(err);
});
