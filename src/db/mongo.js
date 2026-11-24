const mongoose =require("mongoose");

const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta la variable MONGODB_URI en el .env");
  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");
};

module.exports = connectMongo;