/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require('mongoose');

var ClassSchema = mongoose.Schema({
    className  : String,
    teacherName: String
});

ClassSchema.statics = {
    fetchByName : function (name,cb) {
        return this.findOne({className : name}).exec(cb);
    },
    fetch : function (cb) {
        return this.find({}).exec(cb);
    },
    fetchById :function (id,cb) {
        return this.findOne({_id : id}).exec(cb);
    },
    fetchByTeacherName : function (name,cb) {
        return this.findOne({teacherName : name}).exec(cb);
    }
};

var Class = mongoose.model('Class',schoolClassSchema);

module.exports = Class ;
