'use strict';

var vm = new Vue({
	el:'#whole',
	data: {
		// 已经点过名
		hasSigned : false,
		// 班级信息
		classList : ['班级1','班级2','班级3','班级4'],
		classChosen : '班级1',
		// 二维码
		qrSrc:'../img/qrCode.jpg',
		// 控制右侧视图
		signing : false,
		chosingInfo : false,
		checkingInfo : false,
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
		// 选择查看信息
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
		// 选择信息查看种类
		chooseInfo : function (event) {
			/* 根据选择的班级更新classChosen timeList studentList */
			this.signing = false
			this.checkingInfo = false
			this.chosingInfo = true
		},
		// 开关点名
		beginSigning : function (event) {
			this.hasSigned = true
			this.signing = true
			this.chosingInfo = false
			this.checkInfo = false
			this.checkTime = false
			this.checkStudent = false
			/* 获取点名二维码 */
			/* 将二维码地址赋值 */
		},
		endSigning : function (event) {
			if (!this.hasSigned) {return}
			this.signing = false
			this.chosingInfo = false
			/* 查看刚刚生成的点名表 */
			this.checkingInfo = true
			// 更新timeInfo和studentInfo数组
			/* 设置时间为当前时间 然后查看当前时间按的签到表 */
			// this.timeChosen = ...
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
})