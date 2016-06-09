/**
 * Created by hongjiyao_2014150120 on 16-6-9.
 */

var express = require('express');
var app = express();
// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 3000);

// 设置路由
var routes = require('./routes')(app);

// 设定静态文件目录，比如本地文件
app.use(express.static(__dirname + '/static'));

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("访问地址为 http://%s:%s", host, port)

})