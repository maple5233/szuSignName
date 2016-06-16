/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require ('../mongoose');
var Teacher = require ('./teacher')

var ClassSchema = new mongoose.Schema ({
    className: String,// main_key
    teacherName: String
}, {strict: true});

ClassSchema.statics = {
    fetchByName: function (name, cb) {
        return this
            .findOne ({className: name})
            .exec (cb);
    },
    fetch: function (cb) {
        return this
            .find ({})
            .exec (cb);
    },
    fetchById: function (id, cb) {
        return this
            .findOne ({_id: id})
            .exec (cb);
    },
    fetchByTeacherName: function (name, cb) {
        return this
            .find ({teacherName: name})
            .exec (cb);
    }
};

var Class = mongoose.model ('Class', ClassSchema);

Class.$routers = [
    {
        // 获取某个老师的所有班级
        method: 'get',
        path: '/class',
        router: (req, res) => {
            var cardId = req.query.cardId;
            Teacher.fetchByCardId (cardId, function (err, theTeacher) {
                if (err) {
                    console.log (err)
                    res.status (200).json ({
                        code: '1004A'// unknown error
                    });
                } else if (theTeacher) {
                    var name = theTeacher.teacherName;
                    // console.log(name)
                    Class.fetchByTeacherName (name, function (err, classes) {
                        if (err) console.log (err)
                        // console.log(classes)
                        res.status (200).json ({
                            code: '0',
                            classList: classes
                        });
                    })
                } else {
                    res.status (200).json ({
                        code: '1004B'// teacher not found
                    });
                }
            })
        }
    },
    {
        // 获取全校的班级
        method: 'get',
        path: '/manager/class',
        router: (req, res) => {
            Class.fetch (function (err, classes) {
                if (err) {
                    console.log (err)
                    res.status (200).json ({
                        code: '1004A'// unknown error
                    });
                } else {
                    res.status (200).json ({
                        code: '0',
                        wholeClassList: classes
                    });
                }
            })
        }
    }
]

module.exports = Class;
