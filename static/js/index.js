'use strict';

var vm = new Vue ({
    el: '#whole',
    data: {
        loginId: '',
        loginPass: '',
        registName: '',
        registId: '',
        registPass: ''
    },
    methods: {
        login: function () {
            this.$http.post ('/login', {
                loginId: this.loginId,
                loginPass: this.loginPass
            }).then (function (result) {
                var res = result.data
                console.log (res.code)
                if (res.code == '0') {
                    window.location.href = '/menu/' + this.loginId
                } else if (res.code == '1002A') {
                    window.alert ('用户不存在')
                    window.location.href = '/'
                } else if (res.code == '1002B') {
                    window.alert ('密码错误')
                    window.location.href = '/'
                } else if (res.code == '1002C') {
                    window.alert ('您的账号尚未通过管理员认证，请等待')
                    window.location.href = '/'
                }
            })
        },
        regist: function () {
            if (this.registName.length > 10) {
                window.alert ('登录名过长！')
                return
            } else if (this.registId.length > 6) {
                window.alert ('校园卡号过长！')
                return
            } else if (this.registPass.length < 6) {
                window.alert ('密码过短！')
            }
            this.$http.post ('/regist', {
                registName: this.registName,
                registId: this.registId,
                registPass: this.registPass,
                registPassed: false
            }).then (function (result) {
                var res = result.data
                if (res.code == '0') {
                    alert ('注册成功 等待审核')
                    window.location.href = '/'
                } else if (res.code == '1001A') {
                    alert ('用户名已经存在')
                    window.location.href = '/'
                } else if (res.code == '-1') {
                    alert ('未知错误')
                    window.location.href = '/'
                }
            })
        }
    }
})