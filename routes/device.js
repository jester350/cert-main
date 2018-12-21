var express = require("express");
var router = express.Router();

var ctrlDevice = require("../controllers/device.controller.js");

console.log("cert route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").all(ctrlDevice.deviceGetAll);

//router.route("/add").get(ctrlDevice.deviceAddOne);
//router.route("/postcert").post(ctrlDevice.devicePost);
router.route("/record:deviceId").get(ctrlDevice.deviceGetOne);
//router.route("/updateCert").post(ctrlDevice.deviceUpdate);
//router.route("/filter").post(ctrlDevice.deviceGetAll);

module.exports = router;