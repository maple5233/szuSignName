/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require('../mongoose');

var StudentSchema = new mongoose.Schema({
    studentName: String,
    cardId : Number,// main_key
    className : String
},{ strict: true });

StudentSchema.statics = {
    fetch : function (cb) {
        return this.find({}).exec(cb);
    },
    fetchByName : function (name,cb) {
        return this.findOne({studentName : name}).exec(cb);
    },
    fetchById :function (id,cb) {
        return this.findOne({cardId : id}).exec(cb);
    },
    fetchByClass : function (name,cb) {
        return this.find({className : name}).exec(cb);
    }
};


var Student = mongoose.model('Student',StudentSchema);

Student.$routers = [
    {
        method: 'get',
        path: '/student/:id',
        router: (req, res) => {
            res.redirect('/');
        }
    }
]

module.exports = Student ;