/**
 * Created by hongjiyao_2014150120 on 16-6-11.
 */
'use strict';
var mongoose = require ('../mongoose');
var Student = require ('./student');

var SignInfoSchema = new mongoose.Schema ({
    className: String,
    signTime: String,
    studentName: String,
    signed: Boolean
}, {strict: true});

SignInfoSchema.statics = {
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
    fetchByName: function (name, cb) {
        return this
            .find ({className: name})
            .exec (cb);
    },
    fetchByClassAndStudentNameAndTime: function (Class, name, time, cb) {
        return this.findOne ({
            studentName: name,
            className: Class,
            signTime: time
        }).exec (cb);
    },
    fetchByClassAndStudentName: function (Class, name, cb) {
        return this
            .find ({
                studentName: name,
                className: Class
            })
            .exec (cb);
    },
    fetchByClassAndTime: function (name, time, cb) {
        return this.find ({
            className: name,
            signTime: time
        }).exec (cb)
    }
};

var SignInfo = mongoose.model ('SignInfo', SignInfoSchema);

SignInfo.$routers = [
    {
        // 获取某个班级所有的签到时间
        method: 'get',
        path: '/signTime',
        router: (req, res) => {
            var name = req.query.className;
            SignInfo.fetchByName (name, (err, signinfos)=> {
                var timeList = [];
                signinfos.forEach (
                    item => {
                        var existed = false;
                        timeList.forEach (
                            time => {
                                if (time === item.signTime)
                                    existed = true;
                            }
                        );
                        if (!existed) {
                            timeList.push (item.signTime);
                        }
                    }
                );
                res.status (200).json ({
                    code: '0',
                    classList: timeList
                });
            })
        }
    },
    {
        // 获取某个班级所有的签到学生
        method: 'get',
        path: '/student',
        router: (req, res) => {
            var name = req.query.className;
            SignInfo.fetchByName (name, (err, signinfos)=> {
                var studentList = [];
                signinfos.forEach (
                    item => {
                        var existed = false;
                        studentList.forEach (
                            time => {
                                if (time === item.studentName)
                                    existed = true;
                            }
                        );
                        if (!existed) {
                            studentList.push (item.studentName);
                        }
                    }
                );
                res.status (200).json ({
                    code: '0',
                    classList: studentList
                });
            })
        }
    },
    {
        method: 'get',
        path: '/timeInfo',
        router: (req, res) => {
            var className = req.query.className;
            var studentName = req.query.studentName;
            SignInfo.fetchByClassAndStudentName (className, studentName, function (err, infos) {
                if (err) {
                    console.log (err)
                    res.status (200).json ({
                        code: '-1'
                    })
                }
                else {
                    res.status (200).json ({
                        code: '0',
                        infos: infos
                    })
                }
            })
        }
    },
    {
        method: 'get',
        path: '/studentInfo',
        router: (req, res) => {
            var className = req.query.className;
            var signTime = req.query.signTime;
            SignInfo.fetchByClassAndTime (className, signTime, function (err, infos) {
                if (err) {
                    console.log (err)
                    res.status (200).json ({
                        code: '-1'
                    })
                }
                else {
                    res.status (200).json ({
                        code: '0',
                        infos: infos
                    })
                }
            })
        }
    },
    {
        method: 'post',
        path: '/sign',
        router: (req, res) => {
            var className = req.body.className;
            Student.fetchByClass (className, function (err, students) {
                if (err) {
                    console.log (err);
                    res.status (200).json ({
                        code: '-1'
                    })
                }
                else {
                    // console.log (students)
                    var date = new Date ();
                    var month = date.getMonth () + 1;
                    var dateString;
                    if (month >= 10) {
                        dateString = date.getFullYear () + '-' + month + '-' + date.getDate ();
                    }
                    else {
                        dateString = date.getFullYear () + '-0' + month + '-' + date.getDate ();
                    }
                    students.forEach (
                        student => {
                            var signInfoModel = new SignInfo ({
                                className: className,
                                studentName: student.studentName,
                                signTime: dateString,
                                signed: false
                            });
                            signInfoModel.save (function (err) {
                                if (err) console.log (err);
                            });
                        }
                    );
                    res.status (200).json ({
                        code: '0'
                    })
                }
            })
        }
    },
    {
        method: 'put',
        path: '/sign',
        router: (req, res) => {
            var className = req.body.className;
            var cardId = req.body.cardId;
            var studentName = '';
            var signed = req.body.signed;
            Student.fetchById (cardId, function (err, theStudent) {
                if (err) {
                    console.log (err);
                    res.status (200).json ({
                        code: '-1'
                    });
                } else if (theStudent === null) {
                    console.log ('theStudent is null')
                    res.status (200).json ({
                        code: '-3'
                    });
                } else {
                    studentName = theStudent.studentName;
                }
                var date = new Date ();
                var month = date.getMonth () + 1;
                var dateString;
                if (month >= 10) {
                    dateString = date.getFullYear () + '-' + month + '-' + date.getDate ();
                }
                else {
                    dateString = date.getFullYear () + '-0' + month + '-' + date.getDate ();
                }
                console.log (className + ' ' + studentName + ' ' + dateString)
                SignInfo.fetchByClassAndStudentNameAndTime (className, studentName, dateString, function (err, theInfo) {
                    if (err) {
                        console.log (err);
                        res.status (200).json ({
                            code: '-1'
                        });
                    }
                    else {
                        if (theInfo === null) {
                            console.log ('theInfo is null')
                            res.status (200).json ({
                                code: '-2'
                            })
                        }
                        else {
                            // console.log(theInfo)
                            // console.log(signed)
                            theInfo.signed = signed;
                            // console.log(theInfo);
                            theInfo.save (function (err) {
                                if (err) console.log (err)
                            })
                            res.status (200).json ({
                                code: '0'
                            })
                        }
                    }
                });
            });
        }
    },
    {
        method: 'put',
        path: '/changeSign',
        router: (req, res) => {
            var className = req.body.className;
            var studentName = req.body.studentName;
            var signed = req.body.signed;
            var date = req.body.signTime;
            // console.log(className)
            // console.log(studentName)
            // console.log(signed)
            // console.log(date)
            SignInfo.fetchByClassAndStudentNameAndTime (className, studentName, date, function (err, theInfo) {
                if (err) {
                    console.log (err);
                    res.status (200).json ({
                        code: '-1'
                    });
                }
                else {
                    if (theInfo === null) {
                        console.log ('theInfo is null')
                        res.status (200).json ({
                            code: '-2'
                        })
                    }
                    else {
                        // console.log(theInfo)
                        // console.log(signed)
                        theInfo.signed = signed;
                        // console.log(theInfo);
                        theInfo.save (function (err) {
                            if (err) console.log (err)
                        })
                        res.status (200).json ({
                            code: '0'
                        })
                    }
                }
            });
        }
    }
]
module.exports = SignInfo;