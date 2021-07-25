const getLogin = {
	data(){
		return {
			user_id:uni.getStorageSync('username'),
		}
	},
	onShow(){
		this.getLogin()	
	},
	methods: {
		getLogin(){
			if(this.user_id == "" || this.user_id == undefined){
				uni.reLaunch({
					url: '../login/login',
				});
			}
		}
	}
}

export default getLogin