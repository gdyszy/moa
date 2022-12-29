<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="username" label="用户名">
				<uni-easyinput placeholder="用户名，不允许重复" :disabled="true" v-model="formData.username" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname" required label="昵称">
				<uni-easyinput placeholder="用户昵称" v-model="formData.nickname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" required pattern label="手机号码">
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" maxlength="11"/>
			</uni-forms-item>
			<!-- <uni-forms-item name="mobile_confirmed" label="手机号验证状态">
				<uni-data-checkbox v-model="formData.mobile_confirmed"
					:localdata="formOptions.mobile_confirmed_localdata" />
			</uni-forms-item>
			<uni-forms-item name="avatar" label="头像地址">
				<uni-easyinput placeholder="头像地址" v-model="formData.avatar" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="comment" label="备注">
				<uni-easyinput placeholder="备注" v-model="formData.comment" trim="both" />
			</uni-forms-item> -->
			<uni-forms-item name="" label="部门名称">
				<uni-easyinput placeholder="选择部门" @focus="showTree('department')" v-model="formData.department_name" trim="both"
					@iconClick="showTree('department')" suffixIcon="search" />
			</uni-forms-item>
			<uni-forms-item name="department_id" label="部门ID" v-show="false">
				<uni-easyinput placeholder="部门ID" v-model="formData.department_id" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="post" label="职位">
				<uni-easyinput placeholder="职位" v-model="formData.post" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="email" label="邮箱">
				<uni-easyinput placeholder="邮箱地址" v-model="formData.email" trim="both" />
			</uni-forms-item>
		<!-- 	<uni-forms-item name="email_confirmed" label="邮箱验证状态">
				<uni-data-checkbox v-model="formData.email_confirmed"
					:localdata="formOptions.email_confirmed_localdata" />
			</uni-forms-item>
			<uni-forms-item name="gender" label="性别">
				<uni-data-checkbox v-model="formData.gender" :localdata="formOptions.gender_localdata" />
			</uni-forms-item>
			<uni-forms-item name="inviter_uid" label="上级邀请者">
				<uni-data-checkbox :multiple="true" v-model="formData.inviter_uid" />
			</uni-forms-item> 
			<uni-forms-item name="last_login_date" label="最后登录日期">
				<uni-datetime-picker return-type="timestamp" :disabled="true" :value="formData.last_login_date" />
			</uni-forms-item>
			<uni-forms-item name="last_login_ip" label="最后登录时 IP 地址">
				<uni-easyinput placeholder="最后登录时 IP 地址" :disabled="true" v-model="formData.last_login_ip" />
			</uni-forms-item>
			 <uni-forms-item name="my_invite_code" label="用户自身邀请码">
				<uni-easyinput placeholder="用户自身邀请码" v-model="formData.my_invite_code" />
			</uni-forms-item>
			<uni-forms-item name="password_secret_version" label="passwordSecret">
				<uni-easyinput placeholder="密码使用的passwordSecret版本" type="number"
					v-model="formData.password_secret_version" />
			</uni-forms-item> -->
			<uni-forms-item name="status" label="用户状态">
				<uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata" />
			</uni-forms-item>
			<!-- <uni-forms-item name="wx_unionid" label="微信unionid">
				<uni-easyinput placeholder="微信unionid" v-model="formData.wx_unionid" />
			</uni-forms-item> -->
			<uni-forms-item name="is_manager" label="是否主管">
				<uni-data-checkbox v-model="formData.is_manager" :localdata="formOptions.is_manager_localdata" />
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
		<!-- 搜索转出选择器 -->
		<tki-tree ref="tkitree" @watchSearch="watchSearch" :range="list" :treeStatus="treeStatus" rangeKey="name"
			confirmColor="#5089f9" @confirm="treeConfirm"></tki-tree>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/uni-id-users.js';
import tkiTree from "@/components/tki-tree/tki-tree.vue"
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
		components: {
			tkiTree
		},
		data() {
			return {
				list: [], //搜索选择器数据
				treeStatus: 1, //树组件加载状态 1，正在加载，2·暂无数据
				selectType: "", //搜索选择器选择的字段
				searchForm: {
					parent_id: ""
				},
				formData: {
					"mobile_confirmed": 0,
					"ali_openid": "",
					"avatar": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0f215899-37db-41b7-8231-51232da1a1a3/bd1928fe-1841-4ce6-9827-66c7d8113431.png",
					"comment": "",
					"department_id": "",
					"post": "",
					"email": "",
					"email_confirmed": 0,
					"gender": 0,
					"inviter_uid": [],
					"last_login_date": null,
					"last_login_ip": "",
					"mobile": "",
					"apple_openid": "",
					"my_invite_code": "",
					"nickname": "",
					"password_secret_version": null,
					"realname_auth": null,
					"status": 0,
					"token": [],
					"username": "",
					"wx_openid": null,
					"wx_unionid": "",
					"is_manager": 1
				},
				formOptions: {
					"mobile_confirmed_localdata": [{
							"text": "未验证",
							"value": 0
						},
						{
							"text": "已验证",
							"value": 1
						}
					],
					"email_confirmed_localdata": [{
							"text": "未验证",
							"value": 0
						},
						{
							"text": "已验证",
							"value": 1
						}
					],
					"gender_localdata": [{
							"text": "未知",
							"value": 0
						},
						{
							"text": "男",
							"value": 1
						},
						{
							"text": "女",
							"value": 2
						}
					],
					"status_localdata": [{
							"text": "正常",
							"value": 0
						},
						{
							"text": "禁用",
							"value": 1
						},
						{
							"text": "审核中",
							"value": 2
						},
						{
							"text": "审核拒绝",
							"value": 3
						}
					],
					"is_manager_localdata": [{
							"value": 0,
							"text": "是"
						},
						{
							"value": 1,
							"text": "否"
						}
					]
				},
				rules: {
					...getValidator(["ali_openid", "apple_openid", "avatar", "comment", "department_id", "post", "email",
						"email_confirmed", "gender", "inviter_uid", "last_login_date", "last_login_ip", "mobile",
						"mobile_confirmed", "my_invite_code", "nickname", "password_secret_version", "realname_auth",
						"status", "token", "username", "wx_openid", "wx_unionid","is_manager"
					])
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
		},
		methods: {
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
			// 获取部门
			getDepartment(name) {
				var _this = this;
				_this.treeStatus = 1; //树组件加载状态  {getTree: {}}
				db.collection("opendb-department").where({
						"name": new RegExp(name)
					}).get()
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
						_this.list = listArr;
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
			
					})
			}, //选择器搜索框触发事件
			watchSearch(e) {
				const _this = this;
				clearTimeout(_this.searchTimer);
				_this.searchTimer = setTimeout(function() {
					if (_this.selectType === 'department') {
						_this.getDepartment(e); //搜索部门
					} else if (_this.selectType === 'manager') {
						_this.getManager(e); //搜索人员
					}
				}, 500);
			},
			//选择确定
			treeConfirm(e) {
				const vm = this
				if (this.selectType === 'department') {
					vm.formData.department_id = e[0]._id
					vm.formData.department_name = e[0].name
				} else {
					vm.formData.manager_uid = e[0]._id
					vm.formData.manager_name = e[0].name
				}
			},
			/**
			 * 触发表单提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.submit().then((res) => {
					res.department_id = [this.formData.department_id]
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
					//更新成功后，重新写入userInfo
					let userInfo = uni.getStorageSync('userInfo')
					userInfo['nickname']=this.formData.nickname
					uni.setStorageSync('userInfo',userInfo)
					setTimeout(() => uni.navigateBack(), 500)
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
				db.collection("uni-id-users,opendb-department").where({
						'_id': id
					}).field(
						"department_id.name,department_id._id,department_id.pathName,ali_openid,apple_openid,avatar,comment,post,email,email_confirmed,gender,inviter_uid,last_login_date,last_login_ip,mobile,mobile_confirmed,my_invite_code,nickname,password_secret_version,realname_auth,status,username,wx_openid,wx_unionid,is_manager"
						).get()
					.then((res) => {
						const data = res.result.data[0]
						if (data) {
							this.formData = data
							this.formData.username = this.formData.username._value
						}
						if (this.formData.department_id[0] && this.formData.department_id[0].pathName) {
							this.formData.department_name = this.formData.department_id[0].pathName
							this.formData.department_id = this.formData.department_id[0]._id
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {})
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
