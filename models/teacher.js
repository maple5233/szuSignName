/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require ('../mongoose');

var TeacherSchema = new mongoose.Schema ({
    teacherName: String,
    cardId: Number,// main_key
    cardPass: String,
    passed: Boolean
}, {strict: true})

TeacherSchema.statics = {
    fetch: function (cb) {
        return this
            .find ({})
            .exec (cb)
    },
    fetchByName: function (name, cb) {
        return this
            .findOne ({teacherName: name})
            .exec (cb);
    },
    fetchById: function (id, cb) {
        return this
            .findOne ({_id: id})
            .exec (cb);
    },
    fetchByCardId: function (id, cb) {
        return this
            .findOne ({cardId: id})
            .exec (cb);
    }
};

var Teacher = mongoose.model ('Teacher', TeacherSchema);

Teacher.$routers = [
    {
        method: 'get',
        path: '/manager/teacher',
        router: (req, res) => {
            Teacher.fetch (function (err, teachers) {
                if (err) {
                    console.log (err);
                }
                else {
                    res.status (200).json ({
                        code : '0',
                        teacherInfo: teachers
                    });
                }
            });
        }
    },
    {
        method: 'put',
        path: '/manager/teacher',
        router: (req, res) => {
            var passTeacherId = req.body.cardId;
            var passed =  req.body.passed;
            Teacher.fetchByCardId (passTeacherId,function (err, theTeacher) {
                if (err) {
                    console.log (err);
                    res.status (200).json ({
                        code : '2003A' // 未知错误
                    });
                }
                else if(theTeacher) {
                    // console.log(theTeacher);
                    theTeacher.passed= passed;
                    theTeacher.save(err=>{
                       if(err) console.log(err)
                    });
                    res.status (200).json ({
                        code : '0'
                    });
                } else {
                    res.status (200).json ({
                        code : '2003B' // 找不到对应教师
                    });
                }
            });
        }
    }
]

module.exports = Teacher;
