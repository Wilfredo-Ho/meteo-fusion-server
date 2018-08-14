var express = require('express');
var router = express.Router();

/* GET users listing. */
var mysql = require("mysql");
var responseJson = require("../util/responseJson"); 

//导入mysql模块
var dbConfig = require("../db/DBconfig");
var userSQL = require("../db/usersql");

//使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

//查询所有用户
router.get("/getAll", (req, res, next) => {
  pool.getConnection((errs, conn) => {
    if (errs) {
      responseJson(res, errs.message, '1');
      return;
    }

    conn.query(userSQL.queryAll, (err, results) => {
      if(err){
        responseJson(res, err.message, '1');
      } else {
        responseJson(res, results, '0');
      }

      conn.release();
    });
  });
});

//新增用户
router.post("/add", (req, res, next) => {
  var params = req.body;
  if (!params.name || !params.pwd){
    responseJson(res, "用户名密码不能为空", '1');
    return;
  }
  params.age = params.age || null;
  params.gender = params.gender || null;
  params.info = params.info || null;
  
  pool.getConnection((errs, conn) => {
    if(errs){
      responseJson(res, errs.message, '1');
      return;
    }
    //判断用户名是否重复
    conn.query(userSQL.checkName, [params.name], (err, results) => {
      if(err){
        responseJson(res, err.message, '1');
      } else {
        if (results.length > 0) {
          responseJson(res, "用户名已存在", '1');
        } else {
          conn.query(userSQL.insert, [params.name, params.pwd, params.gender, params.age, params.info], (err, results) => {
            if(err){
              responseJson(res, err.message, '1');
            } else {
              responseJson(res, 'success', '0');
            }
      
            conn.release();
          });
        }
      }
    });
  });
});

//修改用户信息
router.post("/update", (req, res, next) => {
  var params = req.body;

  pool.getConnection((errs, conn) => {
    if (errs) {
      responseJson(res, errs.message, '1');
      return;
    }
    conn.query(userSQL.update, [params.name, params.pwd, params.gender, params.age, params.address, params.id], (err, result) => {
      if(err) {
        responseJson(res, err.message, '1');
      } else {
        responseJson(res, 'success', '0');
      }
      conn.release();
    });
  });
});

//删除用户
router.post("/delete", (req, res, next) => {
  var userId = req.body.userId;

  pool.getConnection((errs, conn) => {
    if (errs) {
      responseJson(res, errs.message, '1');
      return;
    }
    //判断用户是否存在
    conn.query(userSQL.getUserById, [userId], (err, result) => {
      if (err) {
        responseJson(res, err.message, '1');
      } else {
        if (result.length == 0) {
          responseJson(res, "要删除的用户不存在", '1');
        } else {
          //执行删除指令
          conn.query(userSQL.delete, [userId], (err,result) => {
            if(err){
              responseJson(res, err.message, '1');
            } else {
              responseJson(res, 'success', '0');
            }

            conn.release();
          });
        }
      }
    });
  });
});

//登陆
router.post("/login", (req, res, next) => {
  var params = req.body;
  pool.getConnection((errs, conn) => {
    if (errs) {
      responseJson(res, errs.message, '1');
      return;
    }
    //判断用户是否存在
    conn.query(userSQL.login, [params.name, params.pwd], (err, result) => {
      if (err) {
        responseJson(res, err.message, '1');
      } else {
        if (result.length == 0) {
          responseJson(res, "用户不存在", '1');
        } else {
          responseJson(res, 'success', '0');
        }
        conn.release();
      }
    });
  });
});

//获取登陆用户
router.get("/check", (req, res, next) => {
  var userId = req.cookies.userId;
  pool.getConnection((errs, conn) => {
    if (errs) {
      responseJson(res, errs.message, '1');
      return;
    }
    //判断用户是否存在
    conn.query(userSQL.getUserById, [userId], (err, result) => {
      if (err) {
        responseJson(res, err.message, '1');
      } else {
        if (result.length == 0) {
          responseJson(res, "用户不存在", '1');
        } else {
          responseJson(res, 'success', '0');
        }
        conn.release();
      }
    });
  });
});

module.exports = router;
