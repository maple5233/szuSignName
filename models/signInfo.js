/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require('mongoose');

var signInfoSchema = mongoose.Schema({
    className : String,
    signTime : String,
    studentName: String,
    signed : Boolean
});

signInfoSchema.statics = {
    fetch : function (cb) {
        return this.find({}).exec(cb);
    },
    fetchById :function (id,cb) {
        return this.findOne({_id : id}).exec(cb);
    },
    fetchByClassAndStudentName : function (Class,name,cb) {
        return this.findOne({
            studentName : name,
            className : Class
        }).exec(cb);
    },
    fetchByClassAndTime : function (name,time,cb) {
        return this.find({
            className : name,
            signTime : time
        }.exec(cb))
    }
};

var signInfo = mongoose.model('signInfo',signInfoSchema);


module.exports = signInfo ;