<template>
	<view class="page">
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="chooseAndUploadFile()">
				<text class="list-text">更改头像</text>
				<image v-model="avatar" class="logo-s" :src="avatar"></image>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="goto">
				<text class="list-text">修改密码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="edit">
				<text class="list-text">修改个人资料</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="bindLogout">
				<text class="list-text">切换账号</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	const db = uniCloud.database();
	const dbCollectionName = 'uni-id-users';

	export default {
		data() {
			return {
				avatar: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png',
				inviteUrl: '',
				logoutBtnLoading: false
			}
		},
		computed: {
			...mapState(['hasLogin', 'forcedLogin', 'userName'])
		},
		onLoad(e) {
			this.avatar = e.avatar
			this.uid = e.id
		},
		methods: {
			...mapMutations(['logout']),
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
						if (e.result.code == 0) {
							this.logout();

						} else {
							this.logout();
							/* uni.showModal({
								content: e.result.msg,
								showCancel: false
							}) */
							console.log('登出失败', e);
						}

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
			goto() {
				uni.navigateTo({
					url: '../pwd/update-password'
				})
			},
			edit() {
				uni.navigateTo({
					url: '../pwd/edit?id=' + this.uid,
				})
			},
			chooseAndUploadFile(file) {
				uniCloud.chooseAndUploadFile({
					type: 'image',
					onChooseFile: (res) => {
						if(res.tempFilePaths){
										uni.showLoading({
										  title: "头像上传中...",
										});  
						}
						const processAll = []
						for (let i = 0; i < res.tempFiles.length; i++) {
							processAll.push(this.cropImg(res.tempFiles[i]))
						}
						return Promise.all(processAll).then((fileList) => {
							let result = {
								tempFilePaths: []
							}
							result.tempFiles = fileList.map((fileItem, index) => {
								result.tempFilePaths.push(fileItem.path)
								return {
									path: fileItem.path,
									cloudPath: '' + Date.now() + index + '.' + fileItem.ext, // 云端路径，这里随便生成了一个
									fileType: fileItem.fileType
								}
							})
							return result
						})
					}
				}).then(res => {
					this.submitForm(res.tempFiles[0].url)
				}).catch((err) => {
				}).finally(() => {
					uni.hideLoading()
				})
			},
			cropImg(file) {
				return new Promise((resolve, reject) => {
					let ext
					let filePathProcessed = file.path // 处理结果
					// #ifdef H5
					ext = file.name.split('.').pop()
					resolve({
						path: filePathProcessed,
						ext,
						fileType: file.fileType
					})
					// #endif
					// #ifndef H5
					uni.getImageInfo({
						src: file.path,
						success(info) {
							ext = info.type.toLowerCase()
							resolve({
								path: filePathProcessed,
								ext,
								fileType: file.fileType
							})
						},
						fail(err) {
							reject(new Error(err.errMsg || '未能获取图片类型'))
						}
					})
					// #endif
				})
			},
			submitForm(logourl) {
				console.log(logourl)
				console.log(this.uid)
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).where({
						_id: this.uid
					})
					.update({
						avatar: logourl
					}).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '修改成功'
						})
						setTimeout(() => uni.navigateBack({
							delta: 1
						}), 500)
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
			},
			logout() {
				uni.removeStorageSync('uni_id_token')
				uni.removeStorageSync('username')
				uni.removeStorageSync('uni_id_has_pwd')
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				this.inviteUrl = ''
				// if (this.forcedLogin) {
				uni.reLaunch({
					url: '../login/login',
				});
				// }
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
		background-color: #D9D9D9;
		flex-direction: row;
		align-items: center;
		display: flex;
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
		margin-top: 16rpx;
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

	.logo-s {
		height: 48rpx;
		width: 48rpx;
		line-height: 90rpx;
		margin-top: 20rpx;
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
</style>
