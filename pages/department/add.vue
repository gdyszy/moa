<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="parent_id" label="">
				<uni-easyinput placeholder="父级部门ID" v-model="formData.parent_id" />
			</uni-forms-item>
			<uni-forms-item name="name" label="部门名称" required>
				<uni-easyinput placeholder="部门名称" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="level" label="">
				<uni-easyinput placeholder="部门层级，为提升检索效率而作的冗余设计" type="number" v-model="formData.level" />
			</uni-forms-item>
			<uni-forms-item name="sort" label="显示顺序">
				<uni-easyinput placeholder="部门在当前层级下的顺序，由小到大" type="number" v-model="formData.sort" />
			</uni-forms-item>
			<uni-forms-item name="manager_uid" label="">
				<uni-easyinput placeholder="部门主管的userid， 参考`uni-id-users` 表" v-model="formData.manager_uid" />
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
	} from '../../js_sdk/validator/opendb-department.js';

	const db = uniCloud.database();
	const dbCollectionName = 'opendb-department';

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
					"parent_id": "",
					"name": "",
					"level": null,
					"sort": null,
					"manager_uid": ""
				},
				formOptions: {},
				rules: {
					...getValidator(["parent_id", "name", "level", "sort", "manager_uid"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
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
			}
		}
	}
</script>

<style>
	.uni-container {
		padding: 15px;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
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
