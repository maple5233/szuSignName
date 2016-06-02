var vm = new Vue({
	el:'#whole',
	data: {
		loginId : '',
		loginPass : '',
		registName : '',
		registId : '',
		registPass : ''
	},
	methods: {
		login: function () {
			console.log('Id='+this.loginId+' Ps='+this.loginPass)
		},
		regist: function() {
			console.log('Name='+this.registName)
			console.log('Id='+this.registId)
			console.log('Pass='+this.registPass)
		}
	}
})