var express = require("express");
var router = express.Router();

var ctrlUsers = require("../controllers/systems.controller.js");

console.log("users route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").get(ctrlSystems.admin);

module.exports = router;