<template>
	<view class="content1">
		<view class="imgv">
			<image class="logo-img" src="@/static/img/icon_@3x.png"></image>
		</view>

		<view class="input-group" v-if="loginType === '0'">
			<view class="input-row border">
				<m-input type="text" focus clearable v-model="mobile" placeholder="请输入手机号"></m-input>
			</view>
			<view class="input-row border">
				<m-input type="text" v-model="code" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn" @click="sendSmsCode">{{codeDuration ? codeDuration + 's' : '获取验证码' }}</view>
			</view>
		</view>
		<view class="input-group" v-else-if="loginType === '2'">
			<view class="input-row border">
				<m-input type="text" focus clearable v-model="email" placeholder="请输入邮箱地址"></m-input>
			</view>
			<view class="input-row border">
				<m-input type="text" v-model="emcode" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn" @click="setVerifyCode">{{codeDuration ? codeDuration + 's' : '获取验证码' }}
				</view>
			</view>
		</view>
		<view class="input-group" v-else-if="loginType === '3'">
			<view class="tit1">
				优势智云移动办公平台
			</view>
			<view class="tit2">
				更轻量的移动办公体验
			</view>
		</view>
		<view class="input-group" v-else>
			<view class="input-row border">
				<m-input type="text"  clearable v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view v-if="needCaptcha" class="input-row border">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="captchaText" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn captcha-view" @click="captcha('refreshCaptcha')">
					<i v-if="captchaing" class="uni-icon_toast uni-loading"></i>
					<img v-if="!captchaing" :src="captchaBase64" width="100%" height="100%"></img>
				</view>
			</view>
		</view>
		<view class="btn-row" v-if="loginType=='3'">
			<button type="primary" class="primarywx" :loading="loginBtnLoading" @tap="toLogin('weixin')">微信一键登录</button>
		</view>
		<view class="btn-row" v-if="loginType!='3'">
			<button type="primary" class="primary" :loading="loginBtnLoading" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row" v-if="loginType!='3'">
			<navigator url="../reg/reg">没有账号？</navigator>
			<navigator style="color: #2D89E5;" url="../reg/reg">现在注册</navigator>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="other">
				其它登录方式
			</view>
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value"
				v-if="provider.value!=value">
				<view>
					<image :src="provider.image" @tap="toLogin(provider.value)"></image>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				<!-- #endif -->
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import {
		univerifyLogin,
		univerifyErrorHandler
	} from '@/common/univerify.js'
	import {
		getDeviceUUID
	} from '@/common/utils.js'

	let weixinAuthService;
	const captchaOptions = {
		deviceId: getDeviceUUID(),
		scene: 'login'
	}

	export default {
		components: {
			mInput
		},
		data() {
			return {
				platform: uni.getSystemInfoSync().platform,
				loginType: '1',
				mobile: '',
				email: '',
				code: '',
				emcode: '',
				value: '1',
				providerList: [{
					"value": "0",
					"image": "../../static/img/btn_phone_@3x.png"
				}, {
					"value": "1",
					"image": "../../static/img/btn_ard_@3x.png"
				}, {
					"value": "2",
					"image": "../../static/img/btn_email_@3x.png"
				}, {
					"value": "3",
					"image": "../../static/img/btn_Wechat@3x.png"
				}],
				hasProvider: false,
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
				codeDuration: 0,
				loginBtnLoading: false,
				hasAppleLogin: false,
				needCaptcha: uni.getStorageSync('uni-needCaptcha'),
				captchaing: false,
				captchaBase64: '',
				captchaText: ''
			}
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'univerifyErrorMsg', 'hideUniverify']),
		onLoad() {
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				weixinAuthService = services.find((service) => {
					return service.id === 'weixin'
				})
				if (weixinAuthService) {
					this.hasWeixinAuth = true
				}
			});
			// #endif
			if (this.needCaptcha) {
				this.captcha('createCaptcha')
			}
		},
		methods: {
			...mapMutations(['login']),
			thisload() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {
						if (e.result.code == 0) {
							this.toMain(e.result.userInfo.username);
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			},
			initProvider() {
				const filters = ['weixin'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							//this.hasProvider = true; 暂不启用第三方登录
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 120;
			},
			sendSmsCode() {
				if (this.codeDuration) {
					uni.showModal({
						content: `请在${this.codeDuration}秒后重试`,
						showCancel: false
					})
				}
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'sendSmsCode',
						params: {
							mobile: this.mobile,
							type: 'login'
						}
					},
					success: (e) => {
						if (e.result.code == 0) {
							uni.showModal({
								content: '验证码发送成功，请注意查收',
								showCancel: false
							})
							this.codeDuration = 60
							this.codeInterVal = setInterval(() => {
								this.codeDuration--
								if (this.codeDuration === 0) {
									if (this.codeInterVal) {
										clearInterval(this.codeInterVal)
										this.codeInterVal = null
									}
								}
							}, 1000)
						} else {
							uni.showModal({
								content: '验证码发送失败：' + e.result.msg,
								showCancel: false
							})
						}

					},
					fail(e) {
						uni.showModal({
							content: '验证码发送失败',
							showCancel: false
						})
					}
				})
			},
			async loginByPwd() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.username.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 3 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const data = {
					username: this.username,
					password: this.password,
					captcha: this.captchaText,
					...captchaOptions
				};
				this.loginBtnLoading = true
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: data
					},
					success: (e) => {
						if (e.result.code == 0) {
							this.needCaptcha = false;
							const username = e.result.username || '新用户'
							uni.setStorageSync('username', username)
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('userInfo', e.result.userInfo)
							uni.setStorageSync('login_type', 'online')
							uni.setStorageSync('uni_id_has_pwd', true)
							this.toMain(this.username);
						} else {
							uni.showModal({
								content: e.result.message,
								showCancel: false
							})

							this.needCaptcha = e.result.needCaptcha;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							if (this.needCaptcha) {
								this.captcha('createCaptcha')
							}
						}
					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.loginBtnLoading = false
					}
				})
			},
			loginBySms() {
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				if (!/^\d{6}$/.test(this.code)) {
					uni.showModal({
						title: '验证码为6位纯数字',
						showCancel: false
					});
					return;
				}

				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginBySms',
						params: {
							mobile: this.mobile,
							code: this.code
						}
					},
					success: (e) => {

						console.log('login success', e);

						if (e.result.code == 0) {
							const username = e.result.username || '新用户'
							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('username', username)
							uni.setStorageSync('userInfo', e.result.userInfo)
							uni.setStorageSync('login_type', 'online')
							this.toMain(username);
						} else {
							uni.showModal({
								content: e.result.msg,
								showCancel: false
							})
							console.log('登录失败', e);
						}

					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			},
			// 为了演示把这个逻辑放在客户端
			getCode() {
				const randomStr = '00000' + Math.floor(Math.random() * 1000000)
				this.emcode = randomStr.substring(randomStr.length - 6)
			},
			setVerifyCode(type) {
				if (!/.+@.+/.test(this.email)) {
					uni.showModal({
						content: '请输入正确的邮箱',
						showCancel: false
					})
					return
				}
				this.getCode()
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'setVerifyCode',
						params: {
							email: this.email,
							code: this.emcode,
							type
						}
					},
					success(res) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(res.result)
						})
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '发送失败，请稍后再试'
						})
					}
				})
			},
			loginByEmail() {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginByEmail',
						params: {
							email: this.email,
							code: this.emcode
						}
					},
					success(res) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(res.result)
						})
						if (res.result.code === 0) {
							uni.setStorageSync('uni_id_token', res.result.token)
							uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						}
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '登录失败，请稍后再试'
						})
					}
				})
			},
			bindLogin() {
				switch (this.loginType) {
					case '0':
						this.loginBySms()
						break;
					case '1':
						this.loginByPwd()
						break;
					case '2':
						this.loginByEmail()
						break;
					default:
						break;
				}
			},
			oauth(value) {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					weixinAuthService.authorize(function(res) {
						resolve(res.code)
					}, function(err) {
						console.error(err)
						reject(new Error('微信登录失败'))
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							console.error('授权登录失败：' + JSON.stringify(err));
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			getUserInfo({
				detail
			}) {
				console.log('三方登录只演示登录api能力，暂未关联云端数据');
				if (detail.userInfo) {
					this.loginLocal(detail.userInfo.nickName);
				} else {
					uni.showToast({
						icon: 'none',
						title: '登陆失败'
					});
				}
			},
			loginLocal(nickName) {
				uni.setStorageSync('login_type', 'local')
				uni.setStorageSync('username', nickName)
				this.toMain(nickName);
			},
			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				uni.reLaunch({
					url: '../index/index',
				});
			},
			toLogin(value) {
				if (value === '2' || value === '1' || value === '0' || value === '3') {
					this.value = value
					this.loginType = value
					return;
				}
				if (value === 'weixin') {
					this.loginByWeixin(value)
					return;
				}

				uni.showModal({
					content: `${value}登录只演示登录api能力，暂未关联云端数据`,
					showCancel: false,
					complete: () => {
						console.log(`${value}登录只演示登录api能力，暂未关联云端数据`);
						uni.login({
							provider: value,
							success: (res) => {
								uni.getUserInfo({
									provider: value,
									success: (infoRes) => {
										/**
										 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
										 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
										 */
										this.loginLocal(infoRes.userInfo.nickName);
									},
									fail() {
										uni.showToast({
											icon: 'none',
											title: '登陆失败'
										});
									}
								});
							},
							fail: (err) => {
								console.error('授权登录失败：' + JSON.stringify(err));
							}
						});
					}
				})
			},
			loginByWeixin(value) {
				this.oauth(value).then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code,
							}
						}
					})
				}).then((res) => {
					if (res.result.code === 0) {

						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						uni.setStorageSync('login_type', 'online')
						uni.setStorageSync('username', '微信用户')
						this.toMain('微信用户')
					}
				}).catch((e) => {
					console.error(e)
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试'
					})
				})
			},
			async captcha(action, args) {
				if (this.captchaing) return;

				// 验证不loading
				this.captchaing = true;

				let {
					result: res
				} = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action,
						params: {
							...captchaOptions,
							...args
						}
					}
				})
				this.captchaing = false;
				if (res.code === 0) {
					this.captchaBase64 = res.captchaBase64
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message,
						duration: 1000
					})
				}
				return res;
			}

		},
		onReady() {
			this.initPosition();
			this.initProvider();
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.thisload()
			}
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style>
	.content1 {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		overflow-x: hidden;
	}

	.imgv {
		width: 100%;
		padding: 56rpx 316rpx 0 314rpx;
	}

	.logo-img {
		width: 120rpx;
		height: 120rpx;
		display: inline-block;
		border-radius: 10px;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 70rpx;
		position: relative;
		width: 610rpx;
		padding: 0 70rpx 53rpx 70rpx;
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
		background-color: #FFFFFF;
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
		background-color: #fff;
	}

	.tit1 {
		color: #333333;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 17px;
		line-height: normal;
		letter-spacing: 1px;
		text-align: center;
		margin-bottom: 4px;
	}

	.tit2 {
		color: #999999;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 12px;
		line-height: normal;
		letter-spacing: 4px;
		text-align: center;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 610rpx;
		height: 51.5px;
		line-height: 40px;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 0px;
		border-radius: 4px;
	}

	button.primary {
		background: #3B88F5;
		width: 610rpx;
		height: 98rpx;
		color: #FFFFFF;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: center;
		padding-top: 28rpx;
	}

	button.primarywx {
		background: #53B821;
		width: 610rpx;
		height: 98rpx;
		color: #FFFFFF;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: center;
		padding-top: 28rpx;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		margin-left: auto;
		margin-right: 70rpx;
	}

	.action-row navigator {
		color: #999999;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 12px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: right;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		/* align-items: center; */
		justify-content: space-around;
		flex-wrap: wrap;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0 140rpx;
		/* width: 100%; */
	}

	.other {
		color: #999999;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 12px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: center;
		width: 100%;
		padding-bottom: 20px;
		padding-left: 20rpx;
	}

	.oauth-image {
		position: relative;
		width: 98rpx;
		height: 98rpx;
		/* border: 1px solid #dddddd;
		border-radius: 50px;
		background-color: #ffffff; */
	}

	.oauth-image image {
		width: 98rpx;
		height: 98rpx;
		margin: 20rpx;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.send-code-btn {
		width: 120px;
		text-align: right;
		color: #2D89E5;
		padding-top: 12rpx;
	}

	.captcha-view {
		line-height: 0;
		justify-content: center;
		align-items: center;
		display: flex;
		position: relative;
		background-color: #f3f3f3;
	}
</style>
