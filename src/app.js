const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");
require("./db/database");
const userRouter = require("./routers/user");
const companyRouter = require("./routers/company");
const productRouter = require("./routers/product");
const cors = require("cors");
const Company = require("./models/company");
const Product = require("./models/product");

app.listen(3000, function () {
  console.log("Server is running on port " + 3000);
});

app.use(cors()); 
app.use(express.json());
app.use(userRouter);
app.use(companyRouter);
app.use(productRouter);

app.post("/api/register", (req, res) => {
  let user_name = req.body.user_name;
  let password = req.body.password;
  if (user_name && password) {
    const user = {
      user_name: user_name,
      password: bcrypt.hashSync(password),
    };
    collection.insertOne(user, (err, result) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      res.send({ message: "Kullanıcı kaydedildi." });
    });
  } else {
    res.send({ message: "Eksik bilgi yolladın" });
  }
});

app.post("/getStatistics", async (req, res) => {
  let countCompanyPromise = Company.count();
  let countProductPromise = Product.count();
  let lastCompaniesPromise = Company.find().sort({ created_at: -1 }).limit(3);
  let lastProductsPromise = Product.find().sort({ created_at: -1 }).limit(3);
  let result = await Promise.all([
    countCompanyPromise,
    lastCompaniesPromise,
    countProductPromise,
    lastProductsPromise,
  ]);
  res.send({
    countCompany: result[0],
    lastCompanies: result[1],
    countProduct: result[2],
    lastProducts: result[3],
  });
});
