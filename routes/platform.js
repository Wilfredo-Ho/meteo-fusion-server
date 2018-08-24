var express = require('express');
var router = express.Router();

/* GET users listing. */
var mysql = require("mysql");
var responseJson = require("../util/responseJson");

//导入mysql模块
var dbConfig = require("../db/DBconfig");

//使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

//查询所有用户
router.get("/", (req, res, next) => {
    pool.getConnection((errs, conn) => {
        if (errs) {
            responseJson(res, errs.message, '1');
            return;
        }

        conn.query("select * from platform", (err, results) => {
            if (err) {
                responseJson(res, err.message, '1');
            } else {
                responseJson(res, results, '0');
            }

            conn.release();
        });
    });
});

module.exports = router;
