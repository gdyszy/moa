<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		onLaunch: function() {
			// console.log('App Launch');
			// #ifdef APP-PLUS
			setTimeout(() => {
				plus.navigator.closeSplashscreen();
			}, 3000)
			// #endif
			
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.login(uni.getStorageSync('username'))
			}

			// #ifdef APP-PLUS
			// 一键登录预登陆，可以显著提高登录速度
			uni.preLogin({
				provider: 'univerify',
				success: (res) => {
					this.setUniverifyErrorMsg()
					this.setHideUniverify(false);
				},
				fail: (err) => {
					this.setUniverifyErrorMsg(err.errMsg)
					// 没有开通一键登录
					this.setHideUniverify(true);
					//console.log("preLogin fail: ", err);
				}
			})
			// #endif
			// #ifdef MP-WEIXIN
			// 获取已授权类别
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.userLocation']) {
						console.log("位置功能已授权")
					} else if (!res.authSetting['scope.userLocation']) {
						uni.authorize({
							scope: 'scope.userLocation',
							success(res) {
								// 授权成功
								console.log(res)
							},
							fail() {
								uni.showModal({
									content: '检测到您没打开获取位置信息功能权限，是否去设置打开？',
									confirmText: "确认",
									cancelText: '取消',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting({
												success: (res) => {
													console.log(res);
												}
											})
										} else {
											console.log('取消');
										}
									}
								})
								console.log("位置授权失败")
							}
						})
					}
				},
				fail() {
					console.log("获取授权信息授权失败")
				}
			})
			// #endif
		},
		onShow: function() {
			// console.log('App Show');
		},
		onHide: function() {
			// console.log('App Hide');
		},
		methods: {
			...mapMutations(['login', 'setUniverifyErrorMsg', 'setHideUniverify']),
		}
	}
</script>

<style>
	@import '@/common/uni.css';
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	@import "components/m-icon/m-icon.css";

	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
		font-size: 14px;
	}

	input,
	textarea,
	button {
		font-size: 14px;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		/* min-height: 100%; */
		display: flex;
		flex: 1;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding: 10px;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 20px;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		/* font-size: 18px; */
		height: 40px;
		line-height: 40px;
	}

	.input-row .title {
		width: 70px;
		padding-left: 15px;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 8px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 25px;
		padding: 10px;
	}

	button.primary {
		background-color: #0faeff;
	}
		    uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		/* border: 1rpx solid rgb(253, 103, 3); */
		background-color: rgba(59,137,245,1);
	}

	uni-checkbox .uni-checkbox-wrapper {
		width: 100%;
	}
	
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before{
		color: #FFFFFF;
	}
    
	uni-checkbox:not([disabled]) .uni-checkbox-input:hover{
		border: 2rpx solid rgba(229,229,229,1);
	}
	.tips {
	  color: #b2b2b2;
	  width: 40%;
	  margin: 20rpx auto;
	  text-align: center;
	}
</style>
