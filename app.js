/**
 * Created by hongjiyao_2014150120 on 16-6-9.
 */
'use strict';

var express = require ('express');
var app = express ();
// var http = require ('http');
var connect = require ('connect');
var bodyParser = require ('body-parser');
var session = require ('express-session');
var path = require ('path');
var flash = require ('express-flash');
var md5 = require ('./md5');

// 配置mongoose
var mongoose = require ('./mongoose.js');
mongoose.db.on ('error', console.error.bind (console, '连接错误:'));
mongoose.db.once ('open', function () {
    console.log ('连接成功')
});
var Teacher = require ('./models/teacher');
var Student = require ('./models/student');
var SignInfo = require('./models/signInfo');
var Class = require ('./models/schoolClass');

// 设定静态文件目录，比如本地文件
app.use (express.static (__dirname + '/static'));
// 配置解析url json
app.use (bodyParser.urlencoded ({
    extended: true
}));
app.use (bodyParser.json ());
// 配置session
app.use (session ({
    secret: 'hjy-2014150120-wyt-2014150229',
    cookie: {
        maxAge: 6000000
    },
    resave: true,
    saveUninitialized: true
}));
// 开启express消息提示
app.use (flash ());

// 设置路由
app.get ('/', function (req, res) {
    if (req.session.teacherId) {
        res.redirect ('/menu/' + req.session.teacherId);
    }
    res.sendFile (path.resolve (__dirname, 'views/index.html'));
});

app.post ('/regist', function (req, res) {
    var newTeacher = req.body;
    var unMatches = false;
    Teacher.find ({cardId: newTeacher.registId}, function (err, theTeacher) {
        if (err) {
            console.log (err);
            res.status (500).json ({
                code: '-1'
            }).end ();
            return
        }
        unMatches = (theTeacher.length === 0);
        if (unMatches) {
            var teacherModel = new Teacher ({
                teacherName: newTeacher.registName,
                cardId: newTeacher.registId,
                cardPass: newTeacher.registPass,
                passed: false // 默认未通过验证
            });
            teacherModel.save (function (err) {
                if (err) console.log (err);
            });
            // req.session.teacherId = newTeacher.registId;
            res.status (200).json ({
                code: '0'
            }).end ();
        } else {
            res.status (200).json ({
                code: '1001A'// message: 'user already existed'
            }).end ();
        }
    })
});

app.post ('/login', function (req, res) {
    if (req.session.teacherId)
        res.status (200).json ({code: '0'}).end ();

    var newTeacher = req.body;
    var unMatches = false;

    Teacher.find ({cardId: newTeacher.loginId}, function (err, theTeacher) {
        if (err) {
            console.log (err);
            res.status (500).json ({code: '-1'}).end ();
        }
        unMatches = (theTeacher.length === 0);
        if (unMatches) {
            res.status (200).json ({
                code: '1002A' // message: 'user is not existed'
            }).end ();
        } else if (theTeacher[ 0 ].cardPass === newTeacher.loginPass) {
            if (theTeacher[ 0 ].passed === true) {
                req.session.teacherId = newTeacher.loginId
                res.status (200).json ({
                    code: '0'
                }).end ();
            }
            else {
                res.status (200).json ({
                    code: '1002C' //message: 'user is not passed now'
                }).end ();
            }
        } else {
            res.status (200).json ({
                code: '1002B' // message: 'password error'
            }).end ();
        }
    })
});

app.get ('/manager', function (req, res) {
    res.sendFile (path.resolve (__dirname, 'views/manager.html'))
});

app.post ('/pass', function (req, res) {
    let pass = req.body.pass;
    if (md5.str2blks_MD5 (pass) == md5.str2blks_MD5 ('8888')) {
        req.session.manager = 'manager';
        res.status (200).json ({
            code: '0'
        }).end ();
    } else {
        res.status (200).json ({
            code: '1001A'
        }).end ();
    }
})

/* 验证是否登录 */
app.all ('*', function (req, res, next) {
    if (req.session.teacherId || req.session.manager) {
        next ();
    } else {
        res.redirect ('/');
    }
});

app.get ('/logout', function (req, res) {
    if (req.session.teacherId) {
        req.session.destroy ()
    }
    if (req.session.manager) {
        req.session.destroy ()
    }
    res.redirect ('/')
});

app.get ('/index', function (req, res) {
    res.sendFile (path.resolve (__dirname, 'views/index.html'))
});

app.get (/menu\/*/, function (req, res) {
    res.sendFile (path.resolve (__dirname, 'views/menu.html'))
});

app.get(/signPage\/*/,function (req,res) {
    res.sendFile (path.resolve (__dirname, 'views/signPage.html'))
});
// 导入来自数据库的RESTFUL路由
[ Teacher, Student, Class, SignInfo ].forEach (item => {
    item.$routers.forEach (router => {
        app[ router.method ] (router.path, router.router)
    })
})


// 设定port变量，意为访问端口
app.set ('port', process.env.PORT || 3000);

var server = app.listen (app.get ('port'), function () {
    console.log ("listening at port 3000...")
})