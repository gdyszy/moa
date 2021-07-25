<template>
	<view class="uni-container">
		<uni-forms class="ulist" :border="true" ref="form" :value="formData" validate-trigger="submit"
			err-show-type="toast">
			<uni-forms-item name="nickname" labelPosition="top" label="姓名" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写姓名" v-model="formData.nickname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" labelPosition="top" label="联系电话" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写联系电话" maxlength="11" v-model="formData.mobile"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="email" labelPosition="top" label="邮箱" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写邮箱" v-model="formData.email" trim="both" />
			</uni-forms-item>
			<view class="item_border"></view>
			<!-- <view class="oauth-row" v-bind:style="{top: positionTop + 'px'}">
				<button type="primary" class="uni-button uni-button-full" @click="submit">提交</button>
			</view> -->

		</uni-forms>
		<view class="status_bar">
		  <button type="default" class="submit" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/opendb-contacts.js';

	const db = uniCloud.database();
	const dbCollectionName = 'uni-id-users';

	function getValidator(fields) {
		let reuslt = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				reuslt[key] = validator[key]
			}
		}
		return reuslt
	}

	export default {
		data() {
			return {
				positionTop: 480,
				formData: {
					"nickname": "",
					"mobile": "",
					"email": ""
				},
				formOptions: {},
				rules: {
					...getValidator(["mobile", "email"])
				}
			}
		},
		onLoad(e) {
			const id = e.id
			this.formDataId = id
			this.getDetail(id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.initPosition();
		},
		methods: {
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 65;
			},
			/**
			 * 触发表单提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.submit().then((res) => {
					this.submitForm(res)
				}).catch((errors) => {
					uni.hideLoading()
				})
			},

			submitForm(value) {
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '修改成功'
					})
					setTimeout(() => uni.navigateBack({
						delta: 2
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

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field('nickname,mobile,email').get().then((
					res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
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
		z-index: 99999;
	}

	.uni-button-group {
		margin-top: 50px;
		display: flex;
		justify-content: center;
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
