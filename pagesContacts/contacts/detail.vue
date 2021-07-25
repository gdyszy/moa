<template>
	<view class="container">
		<view v-if="data">
			<uni-list :border="false" class="uhead">
				<uni-list-item :thumb="data.avatar?data.avatar:'/static/txl/ico_logo_@3x.png'" thumb-size="lg">
					<view slot="body">
						<view class="uni-list-item__content">
							<text class="re-ufont">{{data.nickname}}</text>
							<text class="re-uni-list-item__content-note">{{data.post}}</text>
						</view>
					</view>
				</uni-list-item>
				<view v-if="ContactsEdit">
				<uni-list-item showArrow>
					<view class="editlist" slot="body" @click="handleUpdate()" >
						<text class="editbtn">编辑信息</text>
					</view>
				</uni-list-item>
				</view>
			</uni-list>
			<uni-list>
				<uni-list-item>
					<template slot="header">
						<image class="slot-image" src="/static/txl/ico_page_@3x.png" mode="widthFix"></image>
					</template>
					<view slot="body">
						<text class="re-uni-list-item__content-title ufont">基础信息</text>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="body">
						<view class="re-uni-list-item__content">
							<text class="re-uni-list-item__content-note">姓名</text>
							<text class="re-uni-list-item__content-title">{{data.nickname}}</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="body">
						<view class="re-uni-list-item__content">
							<text class="re-uni-list-item__content-note">所在部门</text>
							<text class="re-uni-list-item__content-title">{{data.department}}</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="body">
						<view class="re-uni-list-item__content">
							<text class="re-uni-list-item__content-note">岗位</text>
							<text class="re-uni-list-item__content-title">{{data.post}}</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="body">
						<view class="re-uni-list-item__content">
							<text class="re-uni-list-item__content-note">联系电话</text>
							<text class="re-uni-list-item__content-title">{{data.mobile}}</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="body">
						<view class="re-uni-list-item__content">
							<text class="re-uni-list-item__content-note">邮箱</text>
							<text class="re-uni-list-item__content-title">{{data.email}}</text>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
		const db = uniCloud.database()
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '@/js_sdk/validator/opendb-contacts.js';

	export default {
		data() {
			return {
				ContactsEdit: '',
				id:'',
				data: [],
				pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png',
				queryWhere: '',
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				options: {
					// 将scheme enum 属性静态数据中的value转成text
					...enumConverter
				}
			}
		},
		onShow() {
				this.getUser(this.id);
		},
		onLoad(e) {
			this.id = e.id;
			this.getUser(e.id);
			if (uni.getStorageSync('userInfo').role == 'admin') {
				this.ContactsEdit = true;
			}
		},
		onReady() {},
		methods: {
			getUser(id) {
				const parent_id = id
				db.collection("uni-id-users,opendb-department").where({
						'_id': id
					}).field("department_id{name},username,nickname,post,mobile,email,avatar").get()
					.then((res) => {
						this.data = res.result.data[0];
                             if(this.data.department_id[0].name){
								this.data.department = this.data.department_id[0].name
							 }
							 if (this.data.nickname != undefined) {
							 	this.data.nickname = this.data.nickname;
							 } else {
							 	this.data.nickname = '用户 (' + this.data.username._value + ')';
							 }
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {})
			},
			handleUpdate() {
				// 打开修改页面
				uni.navigateTo({
					url: './edit?id=' + this.id,
					events: {
						// 监听修改页面成功修改数据后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			}
			// handleDelete() {
			// 	this.$refs.udb.remove(this._id, {
			// 		success: (res) => {
			// 			// 删除数据成功后跳转到list页面
			// 			uni.navigateTo({
			// 				url: './list'
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style>
	.container {
		width: 100%;
		background-color: #f5f5f5;
	}

	.uhead {
		margin-bottom: 20rpx;
	}

	.editlist {
		width: 100%;
		padding: 4rpx 0 4rpx 6rpx;
	}

	.editbtn {
		color: #666666;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.re-uni-list-item__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding-right: 8px;
		flex: 1;
		color: #3b4144;
		// overflow: hidden;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}

	.re-uni-list-item__content--center {
		justify-content: center;
	}

	.re-uni-list-item__content-note {
		margin-top: 6rpx;
		margin-bottom: 6rpx;
		color: #999999;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.re-uni-list-item__content-title {
		color: #333333;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.re-ufont {
		color: #333333;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 17px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
		padding-bottom: 12rpx;
		padding-top: 10rpx;
	}

	.ufont {
		font-weight: bold;
	}
</style>
