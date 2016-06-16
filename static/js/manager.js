'use strict';

var vm = new Vue ({
        el: '#whole',
        data: {
            logined: false,
            passIn: '',
            // 全校班级信息
            wholeClassList: [],
            classChosen: '班级1',
            // 控制右侧视图
            chosingInfo: false,
            checkingInfo: false,
            checkingTec: false,
            // 老师信息列表
            teacherInfo: [
                {
                    name: '姓名',
                    cardId: '校园卡号',
                    cardPass: '校卡密码',
                    passed: true,
                    passText: '通过状态'
                }
            ],
            // 选中班级的信息
            timeList: [],
            studentList: [],
            // 选择了某个学生
            studentChosen: '',
            checkStudent: false,
            timeInfo: [],
            // 选择了某个时间
            timeChosen: '',
            checkTime: false,
            studentInfo: []
        },
        methods: {
            tryLogin: function (event) {
                this.$http.post ('/pass', {
                    pass: this.passIn
                }).then (function (result) {
                    var res = result.data;
                    if (res.code == '0') {
                        this.logined = !this.logined;
                        this.$http.get ('/manager/teacher').then (function (result) {
                            var res = result.data;
                            // console.log (res.teacherInfo[ 0 ]);
                            if(res.code != '0'){
                                console.log(res.code);
                                return
                            }
                            res.teacherInfo.forEach (
                                item=> {
                                    var newTeacher = {
                                        name: item.teacherName,
                                        cardId: item.cardId,
                                        cardPass: item.cardPass,
                                        passed: item.passed,
                                        passText: item.passed ? '已通过' : '未通过'
                                    };
                                    this.teacherInfo.push (newTeacher);
                                }
                            );
                        })
                        this.$http.get('/manager/class').then (function (result) {
                            var classRes =  result.data;
                            if(classRes.code != '0'){
                                console.log(res.code);
                                return
                            }
                            classRes.wholeClassList.forEach(
                                item => {
                                    this.wholeClassList.push(item.className)
                                }
                            )
                        })
                    } else {
                        alert ('密码错误!');
                        window.location.href = '/manager';
                    }
                });
            },
            logout: function (event) {
                this.$http.get('/logout').then(function (err) {
                    if(err) console.log(err)
                });
                window.location.href = '/manager';
            },
            passing: function () {
                this.checkingInfo = false
                this.checkingTec = true
                this.chosingInfo = false
            },
            changePass: function (index) {
                /* 以下更新视图 */
                if (index === 0) return;
                this.teacherInfo[ index ].passed = !this.teacherInfo[ index ].passed;
                this.teacherInfo[ index ].passText = this.teacherInfo[ index ].passed ? '已通过' : '未通过';
                /* 此处发出请求更新后台数据 */
                this.$http.put ('/manager/teacher', {
                    cardId: this.teacherInfo[ index ].cardId,
                    passed: this.teacherInfo[ index ].passed
                }).then (function (result) {
                    var res = result.data;
                    if(res.code != '0'){
                        console.log(res.code);
                    }
                })
            },
            chooseInfo: function () {
                /* 根据选择的班级更新timeList studentList */
                if (this.classChosen.length <= 0) return;
                this.studentList = [];
                this.timeList = [];
                this.$http.get ('/student', {className: this.classChosen}).then (result => {
                    result.data.classList.forEach (
                        student => {
                            this.studentList.push (student)
                        }
                    )
                });
                this.$http.get ('/signTime', {className: this.classChosen}).then (result => {
                    result.data.classList.forEach (
                        time => {
                            this.timeList.push (time)
                        }
                    )
                });
                /* 更新视图 */
                this.checkingInfo = false
                this.checkingTec = false
                this.chosingInfo = true
            },
            selectTime: function (event) {
                this.timeChosen = event.target.innerHTML;
                /* 更新studentInfo */
                this.$http.get ('/studentInfo', {
                    className: this.classChosen,
                    signTime: this.timeChosen
                }).then (
                    result => {
                        this.studentInfo = [];
                        // console.log(result.data.infos)
                        result.data.infos.forEach (
                            info=> {
                                this.studentInfo.push ({
                                    studentName: info.studentName,
                                    signed: info.signed,
                                    signText: info.signed ? '已到' : '未到'
                                });
                            }
                        )
                    }
                );
                this.signing = false
                this.chosingInfo = false
                this.checkTime = true
                this.checkStudent = false
                this.checkingInfo = true
            },
            selectStudent: function (event) {
                this.studentChosen = event.target.innerHTML;
                /* 更新timeInfo */
                this.$http.get ('/timeInfo', {
                    className: this.classChosen,
                    studentName: this.studentChosen
                }).then (
                    result => {
                        this.timeInfo = [];
                        // console.log(result.data.infos)
                        result.data.infos.forEach (
                            info=> {
                                this.timeInfo.push ({
                                    time: info.signTime,
                                    signed: info.signed,
                                    signText: info.signed ? '已到' : '未到'
                                });
                            }
                        )
                    }
                );
                this.signing = false
                this.chosingInfo = false
                this.checkTime = false
                this.checkStudent = true
                this.checkingInfo = true
            },
            changeSign: function (index, cla, event) {
                if (cla === 1) {
                    /* 以下更新视图 */
                    this.timeInfo[ index ].signed = !this.timeInfo[ index ].signed
                    this.timeInfo[ index ].signText = this.timeInfo[ index ].signed ? '已到' : '未到'
                    /* 此处发出请求更新后台数据 */
                    this.$http.put ('/changeSign', {
                        className: this.classChosen,
                        studentName : this.studentChosen,
                        signed: this.timeInfo[ index ].signed,
                        signTime: this.timeInfo[index].time
                    }).then (
                        function (result) {
                            if (result.data.code != '0') {
                                console.log (result.data.code);
                            }
                        }
                    )
                } else {
                    /* 以下更新视图 */
                    this.studentInfo[ index ].signed = !this.studentInfo[ index ].signed
                    this.studentInfo[ index ].signText = this.studentInfo[ index ].signed ? '已到' : '未到'
                    /* 此处发出请求更新后台数据 */
                    this.$http.put ('/changeSign', {
                        className: this.classChosen,
                        studentName: this.studentInfo[ index ].studentName,
                        signed: this.studentInfo[ index ].signed,
                        signTime: this.timeChosen
                    }).then (function (result) {
                            if (result.data.code != '0') {
                                console.log (result.data.code);
                            }
                        }
                    )
                }
            }
        }
    }
)