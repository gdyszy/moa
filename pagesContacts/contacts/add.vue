<template>
	<view class="uni-container">
		<uni-forms :border="true" ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="username" label="账号" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写账号" v-model="formData.username" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname" label="昵称" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写昵称" v-model="formData.nickname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="department_id" label="部门" labelPosition="top" :labclass="0">
				<!-- <view class="depart" @click="showTree()">{{department}}</view> -->
				<uni-easyinput placeholder="选择部门" :disabled="true" v-model="formData.department_name" trim="both"
						@iconClick="showTree('department')" suffixIcon="search" />
				</uni-forms-item>
			</uni-forms-item>
			<uni-forms-item name="post" label="职位" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写职位" v-model="formData.post" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" label="电话" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写联系电话" maxlength="11" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="email" label="邮箱" labelPosition="top" :labclass="0">
				<uni-easyinput :inputBorder="false" placeholder="请填写邮箱" v-model="formData.email" trim="both" />
			</uni-forms-item>
			<uni-easyinput style="display: none;" :inputBorder="false" v-model="formData.pic" trim="both" />
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
			</view>
		</uni-forms>
		<tki-tree ref="tkitree" :range="list" :treeStatus="treeStatus" rangeKey="name"
			confirmColor="#5089f9" @confirm="treeConfirm"></tki-tree>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/opendb-contacts.js';
	import tkiTree from '@/components/tki-tree/tki-tree.vue';
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
				list: [], //搜索选择器数据
				treeStatus: 1, //树组件加载状态 1，正在加载，2·暂无数据
				selectType: "", //搜索选择器选择的字段
				searchForm: {
					parent_id: ""
				},
				multiple: false,
				selectParent: false,
				flod: false,
				"department":"请选择部门",
				formData: {
					"department_name":'',
					"username": "",
					"department_id": [],
					"post": "",
					"mobile": "",
					"email": "",
					"avatar": "/static/txl/ico_logo_@3x.png"
				},
				formOptions: {},
				rules: {
					...getValidator(["username", "nickname", "department_id", "post", "mobile", "email", "avatar"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		onLoad() {
			
		},
		methods: {
			getDepartment() {
				var _this = this;
				_this.treeStatus = 1; //树组件加载状态  {getTree: {}}
				db.collection("opendb-department").get({
					})
					.then((res) => {
						if(res.result.data==''){
							_this.treeStatus = 2;
						}
						let userList = res.result.data;
						let listArr = [];
						userList.forEach(ele => {
							let obj = {};
							obj._id = ele._id;
							if (ele.pathName != undefined) {
								obj.name = ele.pathName;
							} else {
								obj.name = ele.name;
							}
						
							listArr.push(obj);
						});
						this.list = listArr;
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
			
					})
			},
			// 确定回调事件
			treeConfirm(e) {
				this.formData.department_id = [e[0]._id]
				this.formData.department_name = e[0].name
			},
			// 取消回调事件
			treeCancel(e) {
				// console.log(e)
			},
			// 显示树形选择器
			showTree(e) {
				this.list = [];
				if (e === 'department') {
					this.selectType = 'department';
					this.getDepartment('');
				} else {
					this.selectType = 'manager';
					this.getManager('');
				}
			
				this.$refs.tkitree._show();
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
				value.avatar = this.formData.avatar
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
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
	
	.depart{
		width: 90%;
		margin-left: 5%;
		text-align: center;
		border: 1px #dcdfe6 solid;
		border-radius: 3px;
		padding: 10rpx;
	}
</style>
