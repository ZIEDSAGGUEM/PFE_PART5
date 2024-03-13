const router = require("express").Router();
const {Add, Verify} = require("../models/Payment")

router.post("/payment",Add)
router.post("/payment/:id",Verify)

module.exports=router