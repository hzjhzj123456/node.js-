var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "31415926",
    database: 'myblog'
})
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
app.use(allowCrossDomain);
app.use(bodyParser.text())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
function getdate(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}
app.post('/login', function (req, res) {
    let sql = `SELECT * FROM user WHERE user="${req.body.name}" AND password="${req.body.password}"`
    let resultDate = {}
    getdate(sql).then((data) => {
        if (data.length > 0) {
            resultDate.resultCode = 0;
            resultDate.data = null;
            resultDate.resultMsg = "登陆成功";
        } else {
            resultDate.resultCode = 1;
            resultDate.data = null;
            resultDate.resultMsg = "账号或密码错误";
        }
        resultDate = JSON.stringify(resultDate);
        res.send(resultDate);
    })
    // .catch((err)=>{
    //     resultDate.resultCode = 1;
    //     resultDate.data = null;
    //     resultDate.resultMsg = "系统内部错误";
    //     resultDate = JSON.stringify(resultDate);
    //     res.send(resultDate);
    // })
})
app.post("/register", function (req, res) {
    let sql = `SELECT * FROM user WHERE user="${req.body.name}"`;
    let resultDate = {}
    console.log(123456);
    getdate(sql).then((data)=>{
        console.log("~~~~~~~~",data);
        if (data.length>0){
            resultDate.resultCode = 1;
            resultDate.data = null;
            resultDate.resultMsg = "该账号已存在";
            resultDate = JSON.stringify(resultDate);
            res.send(resultDate);
        }else{
            let insertsql = `INSERT INTO user (user,password) value ("${req.body.name}","${req.body.password}")`
            getdate(insertsql).then((data)=>{
                resultDate.resultCode = 0;
                resultDate.data = null;
                resultDate.resultMsg = "注册成功";
                resultDate = JSON.stringify(resultDate);
                res.send(resultDate);
            })
        }
    })
})
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例,访问地址为http://%s:%s", host, port);
});