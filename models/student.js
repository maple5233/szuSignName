/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    studentName: String,
    cardId : Number,
    className : String
});

studentSchema.statics = {
    fetch : function (cb) {
        return this.find({}).exec(cb);
    },
    fetchByName : function (name,cb) {
        return this.findOne({studentName : name}).exec(cb);
    },
    fetchById :function (id,cb) {
        return this.findOne({_id : id}).exec(cb);
    },
    fetchByClass : function (name,cb) {
        return this.find({className : name}).exec(cb);
    }
};

var student = mongoose.model('student',studentSchema);


module.exports = student ;