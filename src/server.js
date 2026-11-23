require("dotenv").config();
const app = require("./app");
const connectMongo = require("./db/mongo.js");
const PORT = process.env.PORT || 3000;

connectMongo()
.then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((error)=>{
 console.log("Error connecting to mongo db: ", error);
 process.exit(1);
});







/*app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});*/