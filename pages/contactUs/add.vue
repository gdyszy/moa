<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="companyname" label="公司名称" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="公司名称" v-model="formData.companyname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="telephone" label="联系电话" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="联系电话" v-model="formData.telephone" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="email" label="邮箱" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="邮箱地址" v-model="formData.email" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="address" label="公司地址" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="公司地址" v-model="formData.address" trim="both" />
			</uni-forms-item>

			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/contactUs.js';

	const db = uniCloud.database();
	const dbCollectionName = 'contactUs';

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
				formData: {
					"companyname": "",
					"telephone": "",
					"email": "",
					"address": ""
				},
				add:true,
				formOptions: {},
				rules: {
					...getValidator(["companyname", "telephone", "email", "address"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.getDetail()
		},
		methods: {
			getDetail() {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).field('companyname,telephone,email,address').get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
						this.add = false
					}
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
				if(this.add){
					// 使用 clientDB 提交数据
					db.collection(dbCollectionName).add(value).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '新增成功'
						})
						this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() => uni.navigateBack(), 500)
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
				}else{
					db.collection(dbCollectionName).update(value).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '修改成功'
						})
						this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() => uni.navigateBack(), 500)
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
	}
</script>

<style>
	.uni-container {
		padding: 15px;
		width: 100%;
	}
	
	.uni-button-group {
		margin-top: 50px;
		display: flex;
		justify-content: center;
	}
	
	.uni-button {
		width: 184px;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		line-height: 1;
		margin: 0;
	}
</style>
