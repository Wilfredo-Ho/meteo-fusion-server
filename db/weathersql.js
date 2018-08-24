module.exports = {
    getMonth: "SELECT b.name as city, b.cid, DATE_FORMAT(a.time, '%Y-%m') AS time, MAX(a.tempH) as max, Min(a.tempL) as min, COUNT(*) AS total, COUNT(a.wea NOT LIKE '%雨%' OR NULL) AS count " +
    "FROM weather a INNER JOIN city b on a.cid = b.cid GROUP BY a.cid, DATE_FORMAT(a.time, '%Y-%m')",
    getDay: "select id, DATE_FORMAT(time, '%Y-%m-%d') as time, tempL, tempH, wind, wea from weather where cid = ? and time >= ? and time < ?"
}