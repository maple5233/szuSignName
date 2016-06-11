/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
    teacherName: String,
    cardId : Number,
    cardPass : String,
    passed : Boolean
});

teacherSchema.statics = {
    fetch : function (cb) {
        return this.find({});
        exec(cb);
    },
    fetchByName : function (name,cb) {
        return this.findOne({teacherName : name});
        exec(cb);
    },
    fetchById :function (id,cb) {
        return this.findOne({_id : id});
        exec(cb);
    }
};

var teacher = mongoose.model('teacher',teacherSchema);

module.exports = teacher
