'use strict';

var vm = new Vue({
	el:'#whole',
	data: {
		logined : true,
		passIn : '',
		// 全校班级信息
		wholeClassList : ['班级1','班级2','班级3','班级4'],
		classChosen : '班级1',
		// 控制右侧视图
		chosingInfo : false,
		checkingInfo : false,
		checkingTec : false,
		// 老师信息列表
		teacherInfo : [
		{
			name : '姓名',
			cardId : '校园卡号',
			cardPass : '校卡密码',
			passed : true,
			passText : '通过状态'
		},
		{
			name : '张席',
			cardId : 130001,
			cardPass : 123456,
			passed : true,
			passText : '已通过'
		},
		{
			name : '于是其',
			cardId : 130002,
			cardPass : 123457,
			passed : false,
			passText : '未通过'
		}
		],
		// 选中班级的信息
		timeList : ['2014-05-13','2014-05-14','2014-05-15','2014-05-16'],
		studentList : ['学生1','学生2','学生3','学生4'],
		// 选择了某个学生
		studentChosen : '',
		checkStudent: false,
		timeInfo : [
		{
			time : '2014-05-13',
			signed : true,
			signText : '已到'
		},
		{
			time : '2014-05-14',
			signed : false,
			signText : '未到'
		},
		{
			time : '2014-05-15',
			signed : true,
			signText : '已到'
		},
		{
			time : '2014-05-16',
			signed : false,
			signText : '未到'
		}
		],
		// 选择了某个时间
		timeChosen : '',
		checkTime : true, 
		studentInfo : [
		{
			studentName : '洪继耀',
			signed : false,
			signText : '未到'
		},
		{
			studentName : '洪继耀',
			signed : true,
			signText : '已到'
		},
		{
			studentName : '洪继耀',
			signed : false,
			signText : '未到'
		},
		{
			studentName : '洪继耀',
			signed : true,
			signText : '已到'
		},
		]
	},
	methods: {
		tryLogin : function(event) {
			/* ajax获取密码 */
			let pass = '123'
			if (this.str2blks_MD5(this.passIn).toString() === this.str2blks_MD5(pass).toString()) {
				this.logined = !this.logined
			} else
			{
				this.passIn = ''
				alert('密码错误!')
			}
			/* ajax */
		},
		logout : function(event) {
			this.logined = false
		},
		str2blks_MD5: function(str) {
			let nblk = ((str.length + 8) >> 6) + 1
			let blks = new Array(nblk * 16)
			for (i = 0; i < nblk * 16; i++)
				blks[i] = 0
			for (i = 0; i < str.length; i++)
				blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8)
			blks[i >> 2] |= 0x80 << ((i % 4) * 8)
			blks[nblk * 16 - 2] = str.length * 8
			return blks
		},
		passing : function(){
			this.checkingInfo = false
			this.checkingTec = true
			this.chosingInfo = false
		},
		changePass : function(index) {
			/* 以下更新视图 */
			if( index === 0) return
			this.teacherInfo[index].passed = !this.teacherInfo[index].passed
			this.teacherInfo[index].passText = this.teacherInfo[index].passed?'已通过':'未通过'
			/* 此处发出请求更新后台数据 */
		},
		chooseInfo : function() {
			/* 根据选择的班级更新classChosen timeList studentList */
			this.checkingInfo = false
			this.checkingTec = false
			this.chosingInfo = true
		},
		selectTime : function (event) {
			this.timeChosen = event.target.innerHTML;
			/* 更新studentInfo */
			this.signing = false
			this.chosingInfo = false
			this.checkTime = true
			this.checkStudent = false
			this.checkingInfo = true
		},
		selectStudent : function (event) {
			this.studentChosen = event.target.innerHTML;
			/* 更新timeInfo */
			this.signing = false
			this.chosingInfo = false
			this.checkTime = false
			this.checkStudent = true
			this.checkingInfo = true
		},
		// 该变签到状态
		changeSign : function (index,cla,event) {
			// console.log(event)
			/* 以下更新视图 */
			if(cla === 1){
				// console.log(1)
				this.timeInfo[index].signed = !this.timeInfo[index].signed
				this.timeInfo[index].signText = this.timeInfo[index].signed?'已到':'未到'
			} else {
				this.studentInfo[index].signed = !this.studentInfo[index].signed
				this.studentInfo[index].signText = this.studentInfo[index].signed?'已到':'未到'
			}
			/* 此处发出请求更新后台数据 */
		}
	}
}
)