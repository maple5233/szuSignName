/**
 * Created by hongjiyao_2014150120 on 16-6-9.
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.sendfile('views/index.html');
    });
    app.get('/index', function (req, res) {
        res.sendfile('views/index.html');
    });
    app.get('/manager', function (req, res) {
        res.sendfile('views/manager.html');
    });
    app.get('/menu', function (req, res) {
        res.sendfile('views/menu.html');
    });
};