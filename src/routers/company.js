const express = require("express");
const { default: mongoose } = require("mongoose");
const router = new express.Router();
const Company = require("../models/company");
const CoreList = require("./CoreList");

router.post("/company/list", async (req, res) => {
  let result = await CoreList(Company, req);
  res.send(result);
});

router.post("/company/create", async (req, res) => {
  let newCompany = req.body;
  let company_name = newCompany.company_name;
  let website = newCompany.website;
  try {
    const takenCompany = await Company.findOne({
      website: website,
      company_name: company_name,
    });
    if (takenCompany) {
      res.status(406).send({ message: "Firma önceden eklenmiş" });
    } else {
      newCompany;
      const company = new Company(newCompany);
      try {
        await company.save();
        res.status(200).send({ company });
      } catch (e) {
        res.status(400).send(e);
      }
    }
  }
  catch (error) {
    res.send(error)
  }
});

router.post("/company/update", async (req, res) => {
  let result = await Company.updateOne({ _id: req.body.id }, req.body)
  res.send({ message: 'Başarıyla güncellendi' })
});

router.post('/company/delete', async (req, res) => {
  let result = await Company.findByIdAndDelete(req.body.id)
  res.send({ message: 'Başarıyla silindi' })
})

module.exports = router;
