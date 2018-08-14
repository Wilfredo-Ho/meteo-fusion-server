var express = require('express');
var router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Server 连接成功");
});

module.exports = router;
