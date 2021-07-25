<template>
	<view class="uni-container">
		<uni-forms class="ulist" :border="true" ref="form" validateTrigger="bind" :rules="rules" @submit="submit">
			<uni-forms-item required labelPosition="top" label="输入原密码" name="oldPassword" labelWidth="85" :labclass="0">
				<input class="uni-input-border" type="password" placeholder="请输入原密码"
					@blur="binddata('oldPassword',$event.detail.value)" />
			</uni-forms-item>
			<uni-forms-item required labelPosition="top" label="输入新密码" name="newPassword" labelWidth="85">
				<input class="uni-input-border" :password="showPassword" placeholder="请输入新密码"
					@blur="binddata('newPassword',$event.detail.value)" />
			</uni-forms-item>
			<uni-forms-item required labelPosition="top" :borderend="true" label="重复新密码" name="passwordConfirmation"
				labelWidth="85" :errorMessage="errorMessage">
				<input @confirm="confirmForm('passwordConfirmation',$event.detail.value)" class="uni-input-border"
					:password="showPasswordAgain" placeholder="重复一次新密码"
					@blur="binddata('passwordConfirmation',$event.detail.value)" />
			</uni-forms-item>
			<view class="item_border"></view>
			<!-- <view class="oauth-row" v-bind:style="{top: positionTop + 'px'}">
				<button class="uni-button uni-button-full" type="primary" @click="submitForm">确定</button>
			</view> -->

		</uni-forms>
		<view class="status_bar">
			<button type="default" class="submit" @click="submitForm">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				positionTop: 480,
				showPassword: true,
				showPasswordAgain: true,
				errorMessage: '',
				password: {
					oldPassword: '',
					newPassword: '',
					passwordConfirmation: ''
				},
				rules: {
					oldPassword: {
						rules: [{
							required: true,
							errorMessage: '请输入旧密码'
						}]
					},
					newPassword: {
						rules: [{
								required: true,
								errorMessage: '请输入新密码'
							},
							{
								minLength: 6,
								errorMessage: '密码长度最小{minLength}个字符'
							}
						]
					},
					passwordConfirmation: {
						rules: [{
								required: true,
								errorMessage: '请确认新密码'
							},
							{
								minLength: 6,
								errorMessage: '密码长度最小{minLength}个字符'
							}
						]
					}
				}
			}
		},
		props: {
			hasBackButton: {
				type: Boolean,
				default: false
			},
			isPhone: {
				type: Boolean,
				default: true
			}
		},
		onReady() {
			this.initPosition();
		},
		methods: {
			...mapMutations(['logout']),
			submit(event) {
				const {
					errors,
					value
				} = event.detail
				if (errors) return
				if (value.oldPassword == undefined) {
					this.errorMessage = '请输入旧密码'
					return
				} else if (value.newPassword == undefined) {
					this.errorMessage = '请输入新密码'
					return
				} else if (value.passwordConfirmation == undefined) {
					this.errorMessage = '请输入确认密码'
					return
				}
				if (value.newPassword !== value.passwordConfirmation) {
					this.errorMessage = '两次输入密码不相同'
					return
				}
				this.save(value)
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 65;
			},
			confirmForm(name, value) {
				this.binddata(name, value)
				this.submitForm()
			},
			submitForm() {
				this.errorMessage = ''
				this.$refs.form.submit()
			},
			save(formData) {
				let that = this
				uni.showLoading()
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'updatePwd',
						params: {
							...formData
						}
					},
					success: (res) => {
						uni.hideLoading()
						if (res.result.code === 0) {
							uni.showModal({
								title: '提示',
								content: res.result.msg,
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										that.logout();
										uni.removeStorageSync('uni_id_token')
										uni.removeStorageSync('username')
										uni.reLaunch({
											url: '/pages/login/login'
										})
									}
								}
							});
						} else {
							uni.showToast({
								title: res.result.msg,
								icon: 'none',
								duration: 2000
							})
						}
					},
					fail: (e) => {
						uni.hideLoading()
						uni.showModal({
							content: '修改密码失败',
							showCancel: false
						})
					}
				})
			},
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
			changePasswordAgain: function() {
				this.showPasswordAgain = !this.showPasswordAgain;
			}
		}
	}
</script>


<style>
	.uni-container {
		width: 100%;
		padding: 15px;
	}

	.ulist {
		background-color: #FFFFFF;
		margin-top: 8px;
		padding-left: 26rpx;
		padding-right: 26rpx;
		padding-bottom: 13.5px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	/* 按钮样式 */
	.uni-button-group {
		margin-top: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pointer {
		cursor: pointer;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		/* border: 1px #e5e5e5 solid; */
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-icon-password-eye {
		position: absolute;
		right: 8px;
		top: 6px;
		font-family: uniicons;
		font-size: 20px;
		font-weight: normal;
		font-style: normal;
		width: 24px;
		height: 24px;
		line-height: 24px;
		color: #999999;
	}

	.uni-eye-active {
		color: #007AFF;
	}

	.uni-button {
		height: 49px;
		padding: 40rpx 0;
		font-size: 14px;
		line-height: 1;
		margin: 0 28rpx;
		background: #3B89F5;
		color: #FFFFFF;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		overflow: initial;
	}


	.uni-button-full {
		width: 100%;
	}

	.item_border {
		margin-bottom: 0;
		padding: 10px 0;
		border-top: 1px #eee solid;
	}

	.status_bar {
		border-top: 1px solid #ccc;
		margin-left: -15px;
		position: fixed;
		height: 140rpx;
		z-index: 1;
		bottom: 0;
		background-color: #fff;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.submit {
		display: flex;
		justify-content: center;
		left: 0;
		right: 0;
		color: #ffffff;
		width: 90%;
		background-color: #3b88f5;
		line-height: 90rpx;
		font-size: 12pt;
	}

	button[type=default] {
		color: #fff;
		background-color: #3b88f5;
	}
</style>
