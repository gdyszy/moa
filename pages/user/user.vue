<template>
	<view class="page">
			<view :style="{ height: statusBarHeight }" class="uni-status-bar">
				<slot />
			</view>
			<uni-nav-bar  backgroundimage="true" title="我的" :navtxtclass="0" :border="false"></uni-nav-bar>
			
		<view class="center">
						<view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
				<image class="logo-img" :src="avatar"></image>
				<view class="logo-title">
					<view class="uni-list-item__content txt">
						<text class="uer-name">{{hasLogin ? nickname : '您未登录,请先登录'}}</text>
						<text class="re-uni-list-item__content-note">{{post}}</text>
					</view>
				</view>
			</view>

			<view class="center-list">
				<view class="center-list-item border-bottom" v-show="hasLogin" @click="goto('set')">
					<image class="slot-image2" src="/static/img/ico_zhgl_@3x.png" mode="widthFix"></image>
					<text class="list-text">账号管理</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="center-list-item border-bottom" @click="clear()">
					<image class="slot-image2" src="/static/img/ico_qlhc_@3x.png" mode="widthFix"></image>
					<text class="list-text">清理缓存</text>
					<text class="rlist-text"></text>
				</view>
				
				<view class="center-list-item border-bottom" @click="goto('upgrade')">
					<image class="slot-image2" src="/static/img/ico_jcgx_@3x.png" mode="widthFix"></image>
					<text class="list-text">检查更新</text>
					<text class="rlist-text">当前为最新版本</text>
				</view>
				<!-- #endif -->
				
				
				<view class="center-list-item border-bottom" @click="goto('contactUs')">
					<image class="slot-image2" src="/static/img/ico_lxwm_@3x.png" mode="widthFix"></image>
					<text class="list-text">联系我们</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				
				<view class="center-list-item border-bottom" @click="goto('opinion')">
					<image class="slot-image2" src="/static/img/ico_opinion@3x.png" mode="widthFix"></image>
					<text class="list-text">意见反馈</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<!-- #ifdef APP-PLUS||H5 -->
				<view class="center-list-item" @click="goto('update_log')">
					<image class="slot-image2" src="/static/img/ico_update_log@3x.png" mode="widthFix"></image>
					<text class="list-text">版本记录</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<!-- #endif -->
			</view>
			<!-- 清缓存 -->
			<uni-popup id="popupDialogclear" ref="popupDialogclear" type="dialog">
				<uni-popup-dialog type="warn" title="清理缓存" content="是否清除缓存" :before-close="true"
					@confirm="dialogConfirmclear" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		univerifyLogin
	} from '@/common/univerify.js'
	
	import {
		updateUseModal
	} from '@/uni_modules/uni-upgrade-center-app/utils/check-update.js'

	export default {
		data() {
			return {
				statusBarHeight: 20,
				ref:false,
				post: '',
				nickname: '',
				avatar: '../../static/txl/ico_logo_@3x.png',
				inviteUrl: '',
				logoutBtnLoading: false,
				hasPwd: uni.getStorageSync('uni_id_has_pwd')
			}
		},
		computed: {
			...mapState(['hasLogin', 'forcedLogin', 'userName'])
		},
		mounted() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
		},
		onShow() {
				this.thisload()
		},
		onReady() {
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.thisload()
			}

		},
		methods: {
			...mapMutations(['logout']),
			thisload(){
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {
						if (e.result.code == 0) {
							this.avatar = e.result.userInfo.avatar
							this.post = e.result.userInfo.post
							this.nickname = e.result.userInfo.nickname
							if (this.nickname == undefined) {
								this.nickname = e.result.userInfo.username
							}
							this.uid = e.result.uid
						} else {
							setTimeout(function() {
								uni.showToast({
									title: "登录信息已过期，请重新登录！",
									icon:'none'
								})
							}, 150);
							this.bindLogout();
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
			clear(type) {
				this.$refs.popupDialogclear.open()
			},
			dialogConfirmclear(done) {
				//清理缓存，只清理特定数据
				uni.removeStorageSync('uni_deviceId')
				uni.removeStorageSync('launchFlag')
				uni.removeStorageSync('uni-needCaptcha')
				uni.removeStorageSync('login_type')
				uni.removeStorageSync('uni_id_has_pwd')
				done();
				uni.showToast({
					title: "清除成功"
				})
			},
			/**
			 * 对话框取消按钮
			 */
			dialogClose(done) {
				this.msgType = 'info'
				done()
			},
			bindLogin() {
				if (!this.hasLogin) {
					univerifyLogin().catch(err => {
						if (err === false) return;

						uni.navigateTo({
							url: '../login/login',
						});
					})
				}
			},
			bindLogout() {
				const loginType = uni.getStorageSync('login_type')
				if (loginType === 'local') {
					this.logout();

					if (this.forcedLogin) {
						uni.reLaunch({
							url: '../login/login',
						});
					}
					return
				}
				this.logoutBtnLoading = true
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'logout'
					},
					success: (e) => {
						this.logout();
						uni.reLaunch({
							url: '../login/login',
						});
					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.logoutBtnLoading = false
					}
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			goto(value) {
				
				switch (value) {
					case 'set':
						uni.navigateTo({
							url: '../seting/list?id=' + this.uid + '&avatar=' + this.avatar,
							events: {}
						})
						break;
					case 'contactUs':
						uni.navigateTo({
							url: '../contactUs/list',
							events: {}
						})
						break;
					case 'opinion':
						uni.navigateTo({
							url: '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
							events: {}
						})
						break;
					case 'upgrade':
						this.update()
						break;
					case 'update_log':
						let p = encodeURIComponent('https://ext.dcloud.net.cn/plugin?id=5038&update_log')
						uni.navigateTo({
							url: `/pages/webview/index?path=${p}`
						})	
						break;
					default:
						break;
				}
				
			},
			update(){
				// #ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					// console.log('应用的 widgetInfo 为：' + widgetInfo.version);
					uniCloud.callFunction({
						name: 'check-version',
						data: {
							appid: plus.runtime.appid,
							appVersion: plus.runtime.version,
							wgtVersion: widgetInfo.version
						},
						success: async (e) => {
							//console.log('async 应用:：',e);
							if (!e.result) return;
							const {
								code,
								message,
								is_silently, // 是否静默更新
								url, // 安装包下载地址
								platform, // 安装包平台
								type // 安装包类型
							} = e.result;
				
							// 此处逻辑仅为实例，可自行编写
							if (code > 0) {
								// 腾讯云和阿里云下载链接不同，需要处理一下，阿里云会原样返回
								const {
									fileList
								} = await uniCloud.getTempFileURL({
									fileList: [url]
								});
								e.result.url = fileList[0].tempFileURL
				
								// 静默更新，只有wgt有
								if (is_silently) {
									uni.downloadFile({
										url: e.result.url,
										success: res => {
											if (res.statusCode == 200) {
												// 下载好直接安装，下次启动生效
												plus.runtime.install(res.tempFilePath, {
													force: false
												});
											}
										}
									});
									return;
								}
				
								/**
								 * 提示升级一
								 * 使用 uni.showModal
								 */
								// return updateUseModal(e.result)
				
								/**
								 * 提示升级二
								 * 官方适配的升级弹窗，可自行替换资源适配UI风格
								 */
								uni.setStorageSync(PACKAGE_INFO_KEY, e.result)
								uni.navigateTo({
									url: `/uni_modules/uni-upgrade-center-app/pages/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
									fail: (err) => {
										console.error('更新弹框跳转失败', err)
										uni.removeStorageSync(PACKAGE_INFO_KEY)
									}
								})
							} else if (code < 0) {
								// TODO 云函数报错处理
								console.error(message)
							}
						},
						fail: (err) => {
							// TODO 云函数报错处理
							console.error(err.message)
						}
					})
				});
				// #endif
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	button {
		width: 100%;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750rpx;
		height: 252rpx;
		padding: 0 32rpx 0 36rpx;
		box-sizing: border-box;
		flex-direction: row;
		align-items: center;
		display: flex;
		background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0f215899-37db-41b7-8231-51232da1a1a3/750d3eb5-53cc-4eab-9fd4-07debb5bfb72.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-position-y: -75px;
		background-color: #ffffff;
		margin-bottom: 10px;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 120rpx;
		height: 120rpx;
		display: inline-block;
	}

	.logo-title {
		/* height: 150rpx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row; */
		margin-left: 32rpx;
		display: inline-block;
		/* position:relative;
		z-index:99999; */
	}

	.uer-name {
		color: #333333;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 18px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.go-login.navigat-arrow {
		color: #FFFFFF;
	}

	.login-title {
		height: 150rpx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.center-list {
		background-color: #FFFFFF;
		width: 750rpx;
		flex-direction: column;
	}

	.center-list-item {
		/* width: 750rpx; */
		box-sizing: border-box;
		flex-direction: row;
		margin: 0 42rpx 0 38rpx;
		padding: 20rpx 0;
		display: flex;
	}

	.border-bottom {
		border-bottom-width: 1rpx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 48rpx;
		height: 48rpx;
		line-height: 90rpx;
		color: #0faeff;
		text-align: center;
		font-family: texticons;
		margin-right: 20rpx;
	}

	.list-text {
		height: 90rpx;
		line-height: 90rpx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90rpx;
		width: 40rpx;
		line-height: 90rpx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}

	.re-uni-list-item__content-note {
		color: #999999;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 13px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.rlist-text {
		height: 90rpx;
		line-height: 90rpx;
		flex: 1;
		color: #999999;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 13px;
		letter-spacing: 0px;
		text-align: right;
	}
	.slot-image2 {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 16px;
		margin-left: 6px;
		margin-top: 12px;
		width: 48rpx;
		height: 48rpx;
	}
</style>
