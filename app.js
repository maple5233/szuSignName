/**
 * Created by hongjiyao_2014150120 on 16-6-9.
 */
'use strict';

var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express_session = require('express-session');
var path = require('path');
var flash = require('express-flash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// 配置mongoose
var mongoose = require('mongoose');
var teacher = require('./models/teacher');
var signInfo = require('./models/signInfo');
var student = require('./models/student');
var schoolClass = require('./models/schoolClass');
mongoose.connect('mongodb://localhost//szuSignName');

// 配置passport
passport.serializeUser(function(user, done) {
    done(null, teacher.id);
});

passport.deserializeUser(function(id, done) {
    teacher.fetchById(id, function(err, teacher) {
        done(err, teacher);
    });
});

passport.use('local', new LocalStrategy(
    function (username, password, done) {
        var user = {
            id: '1',
            loginName: 'admin',
            password: 'pass'
        }; // 可以配置通过数据库方式读取登陆账号

        if (username !== user.username) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (password !== user.password) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    }
));

//解析cookie url json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser);
app.use(express_session({secret: 'szuSign.com', cookie: {
    maxAge: 60000 },resave: true, saveUninitialized: true}));
// passport 配置
app.use(passport.initialize());
app.use(passport.session());
// express 消息提示
app.use(flash());


// 设置路由
app.get('/', function (req, res) {
    res.sendfile('views/index.html');
});

app.post('/login',
    passport.authenticate('local',
        function(req,res){
            res.redirect( '/menu/' + req.user.loginName);
        }));

app.all('*', function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/index', function (req, res) {
    res.sendfile('views/index.html');
});

app.get('/menu/*', function (req, res) {
    res.sendfile('views/menu.html');
});

app.get('/manager', function (req, res) {
    res.sendfile('views/manager.html');
});

// 设定静态文件目录，比如本地文件
app.use(express.static(__dirname + '/static'));

// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log("listening at port 3000...")
})