<template>
	<view class="page" style="flex: 1;">
		<uni-forms class="ulist" :border="true" ref="form" validateTrigger="bind" :rules="rules" @submit="submit">
			<uni-forms-item labelPosition="top" label="输入原密码" name="oldPassword" labelWidth="85" :labclass="0">
				<input class="uni-input-border" type="password" placeholder="请输入原密码" @blur="binddata('oldPassword',$event.detail.value)" />
			</uni-forms-item>
			<uni-forms-item labelPosition="top" label="输入新密码" name="newPassword" labelWidth="85">
				<input class="uni-input-border" :password="showPassword" placeholder="请输入新密码" @blur="binddata('newPassword',$event.detail.value)" />
			</uni-forms-item>

			<uni-forms-item labelPosition="top" :borderend="true" label="重复新密码" name="passwordConfirmation" labelWidth="85" :errorMessage="errorMessage">
				<input @confirm="confirmForm('passwordConfirmation',$event.detail.value)" class="uni-input-border" :password="showPasswordAgain"
				 placeholder="重复一次新密码" @blur="binddata('passwordConfirmation',$event.detail.value)" />
			</uni-forms-item>
			
			<view class="oauth-row" v-bind:style="{top: positionTop + 'px'}">
				<button class="uni-button uni-button-full" type="primary" @click="submitForm">确定</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				positionTop: 0,
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
	.ulist{
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
		color: #000000;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		overflow: initial;
	}


	.uni-button-full {
		width: 100%;
	}
</style>
