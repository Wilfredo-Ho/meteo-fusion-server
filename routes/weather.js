var express = require('express');
var router = express.Router();
var superagent = require("superagent");
var charset = require("superagent-charset");    //解决编码问题
var cheerio = require("cheerio");

/* GET users listing. */
var mysql = require("mysql");
var responseJson = require("../util/responseJson"); 

//导入mysql模块
var dbConfig = require("../db/DBconfig");

//使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

charset(superagent); 

//需要遍历的信息
var BaseUrl = "http://tianqi.eastday.com";
var Cities = ["成都"]; //需要获取的城市
var indexArr = ['cd'];
var Years = ["2018"]; //年份，因为2018年以前dom结构不一样，所以这里只取2018
var Months = ["01", "02", "03", "04", "05", "06", "07", "08"]; //月份

function getCityUrl (city) {
  //返回Promise
  return new Promise((resolve, reject) => {
      superagent.get(BaseUrl + "/history.html")
          .charset("utf-8")
          .end((err, sres) => {
              if (err) {
                  next(err);
                  return;
              }
              let $ = cheerio.load(sres.text);
              //后续继续遍历的基址
              let href = $(".letter-box").find("a[title='" + city + "']").attr("href");
              resolve(href);
          });
  })
}

//获取指定城市在指定时间的数据
function getData (href, city) {
  let year = Years[0];
  return  Months.map(month => {
      let url = BaseUrl + href.replace(".html", "_" + year + month + '.html' );
      //获取天气数据
     return new Promise((resolve, reject1) =>
      {
          superagent.get(url)
              .charset("utf-8")
              .end((err1, sres1) => {
                  if (err1) {
                    reject1(err1);
                    return;
                  }

                  let $ = cheerio.load(sres1.text);
                  let arr = [];
                  $("#weaDetailContainer").find(".weatherInfo-item").each((index, item) => {
                      let $item = $(item);
                      arr.push({
                          time: year + "-" + month + "-" + $item.find(".dateBox").text().substr(0, 2),
                          wea: $item.find(".weather-name").text(),
                          tempL: $item.find(".low-temp").text(),
                          tempH: $item.find(".high-temp").text(),
                          wind: $item.find(".wind").text(),
                      });
                  });
                  resolve(arr);
              });
      });
  });
}

function dispatch(groups) {
  var results = []
  return (function () {
      var fun = arguments.callee
          , group = groups.shift()
      if (!group) {
          return Promise.resolve(results)
      }

      var promises = []
      group.forEach(function (task) {
          promises.push(
              Promise.resolve(task)
          )
      })

      return Promise.all(promises).then(function (rets) {
          results.push(rets)
          return fun()
      })
  }())
} 

function query (sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if(err){
        reject(err);
      } else {
        conn.query(sql, (err1, rows, fields) => {
          conn.release();
          if(err1){
            reject(err1);
          } else {
            resolve({
              rows: rows,
              fields: fields
            });
          }
        });
      }
    });
  });
}

function makeSql (item, index) {
  //["西青", "哈尔滨", "重庆", "海口", "乌鲁木齐"]

  let sql = "INSERT INTO weather_" + indexArr[index] + " (time, wea, tempH, tempL, wind) values ";
  let arr = [].concat.apply([], item);
  arr.map(group => {
    sql += "('"
      + group.time + "', '"
      + group.wea + "', '"
      + group.tempH + "', '"
      + group.tempL + "', '"
      + group.wind
      + "'),";
  });
  
  return sql.substring(0, sql.length-1);
} 

router.get('/', function(req, res, next) {
  let promiseArr = [];
  promiseArr = Cities.map(city => {
      //遍历城市
      return getCityUrl(city);
  });

  Promise
      .all(promiseArr)
      .then(hrefArr => {
        return hrefArr.map(href => {
          return getData(href);
        });
      })
      .then(arr => {
        return dispatch(arr);
      })
      .then(data => {
        let arr = data.map((item, index) => {
          return query(makeSql(item, index))
        });

        Promise
          .all(arr)
          .then(() => {
            res.json({
              status: true,
              msg: 'success'
            })
          })
          .catch(e => {
            res.json({
              status: false,
              msg: e.message
            })
          })

      })
      .catch(e => {
        res.send(e.message);
      });
});

module.exports = router;
