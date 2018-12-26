var express = require("express");
var router = express.Router();

var ctrlCerts = require("../controllers/certs.controller.js");

console.log("cert route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").all(ctrlCerts.certsGetAll);

router.route("/addcert").get(ctrlCerts.certAddOne);
router.route("/postcert").post(ctrlCerts.certPost);
router.route("/record:certId").get(ctrlCerts.certsGetOne);
router.route("/updateCert").post(ctrlCerts.certUpdate);
router.route("/filter").post(ctrlCerts.certsGetAll);

module.exports = router;