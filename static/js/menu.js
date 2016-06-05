var vm = new Vue({
	el:'#whole',
	data: {
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
		timeList : ['时间1','时间2','时间3','时间4'],
		studentList : ['学生1','学生2','学生3','学生4'],
		// 选择了某个学生
		studentChosen : '洪继耀',
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
		timeChosen : '2014-05-13',
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
			this.signing = false
			this.chosingInfo = false
			console.log(event)
		},
		selectStudnt : function (event) {
			this.signing = false
			this.chosingInfo = false
		},
		// 开关点名
		beginSigning : function (event) {
			this.signing = true
			this.chosingInfo = false
			this.checkInfo = false
			/* 获取点名二维码 */
			/* 将二维码地址赋值 */
		},
		endSigning : function (event) {
			this.signing = false
			/* 查看刚刚生成的点名表 */
			this.checkingInfo = true
			// 更新timeInfo和studentInfo数组
			/* 设置时间为当前时间 然后查看当前时间按的签到表 */
			// this.timeChosen = ...
		}
	}
})