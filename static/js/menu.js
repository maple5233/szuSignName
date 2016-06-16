'use strict';

var vm = new Vue ({
    el: '#whole',
    data: {
        signNo: 0,
        // 已经点过名
        hasSigned: false,
        // 班级信息
        classList: [],
        classChosen: '',
        // 二维码
        qrSrc: '',
        // 控制右侧视图
        signing: false,
        chosingInfo: false,
        checkingInfo: false,
        // 选中班级的信息
        timeList: [],
        studentList: [],
        // 选择了某个学生
        studentChosen: '',
        checkStudent: false,
        timeInfo: [],
        // 选择了某个时间
        timeChosen: '',
        checkTime: true,
        studentInfo: []
    },
    ready() {
        var url = window.location.href;
        // console.log(url)
        var id = parseInt (url.split ('/')[ 4 ]);
        // console.log(id);
        this.$http.get ('/class', {cardId: id}).then (function (result) {
            this.studentList = []
            var classRes = result.data;
            if (classRes.code != '0') {
                console.log (res.code);
                return
            }
            // console.log (classRes.classList)
            classRes.classList.forEach (
                item => {
                    this.classList.push (item.className)
                }
            )
        });
    },
    methods: {
        logout: function (event) {
            this.$http.get ('/logout').then (function (err) {
                if (err) console.log (err)
            });
            window.location.href = '/';
        },
        // 选择查看信息
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
        // 选择信息查看种类
        chooseInfo: function (event) {
            /* 根据选择的班级更新classChosen timeList studentList */
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
            /* 更新视图*/
            this.signing = false
            this.checkingInfo = false
            this.chosingInfo = true
        },
        // 开关点名
        beginSigning: function (event) {
            if (this.signNo >= 2) return;
            // console.log(this.classChosen.length)
            if (this.classChosen.length == 0) return;
            this.signNo++;
            this.hasSigned = true;
            this.signing = true;
            this.chosingInfo = false;
            this.checkTime = false;
            this.checkStudent = false;
            /* 获取点名二维码 */
            // console.log(this.signNo);
            var classCode = encodeURIComponent (this.classChosen);
            // console.log(classCode)
            this.qrSrc = 'http://localhost:3000/signPage/' + classCode;
            $ ('#qrcode').qrcode ({width: 700, height: 700, text: this.qrSrc});
            if (this.signNo == 2) {
                this.$http.post ('/sign', {className: this.classChosen}).then (
                    function (result) {
                        if (result.data.code != '0') {
                            console.log (result.data.code);
                        }
                    }
                )
            }
        },
        endSigning: function (event) {
            if (!this.hasSigned) {
                return;
            }
            this.signing = false;
            this.chosingInfo = false;
            /* 查看刚刚生成的点名表 */
            this.checkingInfo = true;
            /*  设置时间为当前时间 更新studentInfo数组 */
            var date = new Date ();
            var month = date.getMonth () + 1;
            var dateString;
            if (month >= 10) {
                dateString = date.getFullYear () + '-' + month + '-' + date.getDate ();
            }
            else {
                dateString = date.getFullYear () + '-0' + month + '-' + date.getDate ();
            }
            this.timeChosen = dateString;
            this.$http.get ('/studentInfo', {
                className: this.classChosen,
                signTime: this.timeChosen
            }).then (
                result => {
                    this.studentInfo = [];
                    console.log(result.data.infos)
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
            /* 更新timeList和studentList数组 */
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
            /* 然后查看当前时间按的签到表 */
            this.signing = false
            this.chosingInfo = false
            this.checkTime = true
            this.checkStudent = false
            this.checkingInfo = true
        },
        // 该变签到状态
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
})