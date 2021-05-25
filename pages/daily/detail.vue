<template>
	<view class="bg">
		<view class="header">
			<image src="../../static/ico_avatar.png" class="header_avatar" ></image>
			<view>
				<view class="header_name">{{info.title}}</view>
				<view class="header_status">
					<view >{{info.create_date}}</view>
				</view>
			</view>
		</view>
		<view class="baseMsg">
			<view class="baseMsg_header">
				<view class="baseMsg_header_img">
					<image src="../../static/ico_page.png" style="width: 100%; height: 100%;"></image>
				</view>
				<view class="baseMsg_header_title">
					详情信息
				</view>
			</view>
			<view style="padding: 10px 0;">
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">日志日期</view>
					<view class="baseMsg_item_val">{{info.week}}</view>
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">项目名称</view>
					<textarea class="baseMsg_item_val" auto-height type="text" v-model="info.projectName" :disabled="!isEdit" />
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">今日工作</view>
					<textarea class="baseMsg_item_val" auto-height	 type="text" v-model="info.todayWork" :disabled="!isEdit" />
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">明日工作</view>
					<textarea class="baseMsg_item_val" auto-height	 type="text" v-model="info.tomorrowWork" :disabled="!isEdit" />
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">备注</view>
					<textarea class="baseMsg_item_val" auto-height type="text" v-model="info.remarks" :disabled="!isEdit" />
				</view>
			</view>
		</view>
		
		<view class="bottom" v-if="showbtn">
			<view class="bottom_btn" @click="edit" v-if="!isEdit">
				<view class="bottom_ico"><image src="../../static/workOverTime/ico_revise.png" style="width: 100%; height: 100%;"></image></view>
				<view class="bottom_text">修改</view>
			</view>
			<view class="bottom_btn" @click="update" v-else>
				<view class="bottom_ico"><image src="../../static/workOverTime/ico_revise.png" style="width: 100%; height: 100%;"></image></view>
				<view class="bottom_text">确认修改</view>
			</view>
			<view class="bottom_btn" @click="revoke">
				<view class="bottom_ico"><image src="../../static/workOverTime/ico-cancel.png" style="width: 100%; height: 100%;"></image></view>
				<view class="bottom_text">撤销</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { timeFormat } from '@/utils/dateUtils.js';
	export default {
		data() {
			return {
				info:{},
				id:'',
				uid:'',
				isEdit:false,
				showbtn:false
			}
		},
		onLoad: function (option) { 
			this.getDailyInfo(option.id,option.uid)
			this.id=option.id
			this.uid=option.uid
			if(uni.getStorageSync('username')==this.uid){
				this.showbtn = true
			}else if(option.state=="true"){
				this.read()
			}else{
			}
		},
		methods:{
			edit(){
				this.isEdit=true
			},
			getDailyInfo(id,uid){
				uni.showLoading({
					title:'请稍等...'
				})
				let formData={
					_id:id,
					user_id:uid
				}
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyGetDetail',
						data: formData
					}
				}).then((res) => {
					uni.hideLoading()
					let result = res.result.data[0]
					this.info = result
					console.log(JSON.stringify(this.info))
					let create_date = timeFormat(result.create_date, "yyyy-MM-dd hh:mm")
					let date = timeFormat(result.create_date, "yyyy年MM月dd日")
					let show_day = new Array("周日","周一","周二","周三","周四","周五","周六")
					let day = new Date(result.create_date).getDay()
					this.info.create_date=create_date
					this.info.week =date +" "+ show_day[day]
				})
			},
			update(){
				let formData = {
					user_id:this.uid,
					_id:this.id,
					info:this.info
				}
				// console.log(formData)
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyUpdate',
						data: formData
					}
				}).then((res) => {
					this.isEdit=false
					uni.showToast({
						title:"修改成功！",
						icon:"none"
					})
					// console.log(res)
				})
			},
			revoke(){
				let formData = {
					user_id:this.uid,
					_id:this.id
				}
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyDelete',
						data: formData
					}
				}).then((res) => {
					console.log(res)
					uni.showToast({
						title:'撤销成功'
					})
					this.timer = setTimeout(() => {
						uni.navigateBack({
						    delta: 2
						});
					}, 1500)
					
				})
			},
			read(){
				let formData = {
					user_id:uni.getStorageSync('username'),
					_id:this.id
				}
				console.log(formData)
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyRead',
						data: formData
					}
				}).then((res) => {
					console.log(res)
				})
			},
		}
	}
	
</script>

<style scoped>
	.header {
		background-color: #FFFFFF;
		padding: 30rpx;
		display: flex;
		margin-bottom: 20rpx;
	}
	.header_avatar {width: 54px; height: 54px; margin-right: 15px; border-radius: 4px;}
	.header_name {
		font-size: 36rpx;
		font-weight: bold;
	}
	.header_status {
		display: flex;
		justify-content: space-between;
		width: 100%;
		color: #999999;
		margin-top: 10rpx;
		font-size: 28rpx;
	}
	.baseMsg {
		padding: 20rpx 30rpx;
		background-color: #FFFFFF;
	}
	.baseMsg_header {
		display: flex;
		align-items: center;
	}
	.baseMsg_header_img {
		width: 24px;
		height: 24px;
		margin-right: 20rpx;
	} 
	.baseMsg_header_title {
		font-weight: bold;
	}
	.baseMsg_item {
		display: flex;
		margin: 20rpx 0;
	}
	.baseMsg_item_title {
		color: #999999;
		width: 140rpx;
	}
	.baseMsg_item_val{
		padding-left: 12px;
		flex: 1;
	}
	.baseMsg_detail {
		border-top: 1px solid #E5E5E5;
		width: 92%;
		margin: 0 auto;
		background-color: #FFFFFF;
		padding-top: 30rpx;
	}
	
	.bottom {
		background-color: #FFFFFF;
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: space-around;
		padding: 5px 0;
	}
	.bottom_ico {
		width: 48rpx;
		height: 48rpx;
		margin: 0 auto;
	}
	.bottom_btn {
		align-items: center;
	}
	.bottom_text {
		font-size: 24rpx;
	}
</style>
