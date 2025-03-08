const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const DB_URL = process.env.DB_URL;

mongoose.set('strictQuery', true);

const connect = async () => {
  try {
    const db = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { name, host } = db.connection;
    console.log(
      `Conectado con éxito a la base de datos ${name} en host: ${host}`
    );
  } catch (error) {
    console.log("Error conectando a la base de datos", error);
  }
};

module.exports = { connect, DB_URL };
