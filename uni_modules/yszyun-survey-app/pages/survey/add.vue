<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="名称">
				<uni-easyinput placeholder="名称" v-model="formData.name" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="description" label="描述">
				<uni-easyinput placeholder="描述" v-model="formData.description" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="status" label="状态">
				<uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata">
				</uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="surveytype" label="问卷类型">
			 <uni-data-picker v-model="formData.surveytype" collection="survey-type" orderby="name asc" field="_id as value, name as text"></uni-data-picker>
			</uni-forms-item>
			<uni-forms-item name="start_time" label="开始时间">
				<uni-datetime-picker return-type="timestamp" v-model="formData.start_time"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="end_time" label="结束时间">
				<uni-datetime-picker return-type="timestamp" v-model="formData.end_time"></uni-datetime-picker>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '../js_sdk/validator/survey.js';
	import {
		mapState
	} from 'vuex'
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'survey';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		data() {
			let formData = {
				"name": "",
				"description": "",
				"status": 0,
				"surveytype": "",
				"start_time": null,
				"end_time": null
			}
			return {
				formData,
				formOptions: {
					"status_localdata": [{
							"text": "关闭",
							"value": 0
						},
						{
							"text": "开启",
							"value": 1
						}
					]
				},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			/**
			 * 验证表单并提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					res.admin_uid  = this.userInfo.username
					res.create_time = Math.round(new Date())
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			}
		}
	}
</script>
