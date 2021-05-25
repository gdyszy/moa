<template>
	<view class="record" @click="checkDetail">
		<view class="record_img">
			<image src="../../static/workOverTime/ico_page_@2x.png" style="width: 100%; height: 100%;"></image>
		</view>
		<view style="width: 85%;">
			<view class="record_detail">
				<view class="record_detail_title" v-if="typeFrom==1">{{listData.username}} | 加班申请表</view>
				<view class="record_detail_title" v-if="typeFrom==2">{{listData.username}} | {{leaveTitle}}申请表</view>
				<view class="record_detail_title" v-if="typeFrom==3">{{listData.username}} | 出差申请表</view>
				<view class="record_detail_title" v-if="typeFrom==4">{{listData.username}} | 外出申请表</view>
				<view class="record_detail_title" v-if="typeFrom==5">{{listData.username}} | 补卡申请表</view>
				<view class="record_detail_ico">
					<image src="../../static/workOverTime/btn_message.png" style="width: 100%; height: 100%;"></image>
				</view>
			</view>
			<view class="record_time">
				<view v-if="!patchCardTime">
					<text>开始时间:</text>
					<text>{{listData.start_time}}</text>
				</view>
				<view v-if="!patchCardTime">
					<text>结束时间:</text>
					<text>{{listData.end_time}}</text>
				</view>
				<view v-if="patchCardTime">
					<text>补卡时间:</text>
					<text>{{listData.start_time}}</text>
				</view>
			</view>
			<view class="record_bottom">
				<view>{{listData.create_date | timeStamp}}</view>
				<view v-if="listData.result == 1">审批中</view>
				<view v-if="listData.result == 10" style="color: #2D89E5;">已通过</view>
				<view v-if="listData.result == 20">未通过</view>
				<view v-if="listData.result == 30" style="color: #F39819;">待审批</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {timeStamp} from '@/utils/time.js'
	
	export default {
		props:{
			listData: {
				type: Object,
				default: {}
			},
			typeFrom: {
				type: Number
			},
			patchCardTime: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				leaveTitle: '请假'
			}
		},
		created() {
			let leaveid = this.listData.leaveid
			if(leaveid === 1){
				this.leaveTitle = '请假'
			}else if(leaveid === 2){
				this.leaveTitle = '年假'
			}else if(leaveid === 3){
				this.leaveTitle = '病假'
			}else if (leaveid === 4){
				this.leaveTitle = '事假'
			}else if (leaveid === 5){
				this.leaveTitle = '产假'
			}
		},
		filters:{
			timeStamp
		},
		methods:{
			checkDetail(){
				this.$emit('checkDetail',{id: this.listData._id})
			}
		}
	}
</script>

<style scoped>
	.record {
		width: 90%;
		margin: 20rpx auto;
		background-color: #FFFFFF;
		display: flex;
		padding: 10rpx 20rpx;
	}
	.record_img {
		width: 58rpx;
		height: 58rpx;
		margin-right: 20rpx;
	}
	.record_detail {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.record_detail_title {
		font-weight: bold;
	}
	.record_detail_ico {
		width: 36rpx;
		height: 36rpx;
	}
	.record_time {
		border-bottom: 2rpx solid #C4C4C4;
		font-size: 24rpx;
		color:  #999999;;
		padding-bottom: 20rpx;
	}
	.record_time view {
		margin: 13rpx 0;
	}
	.record_bottom {
		display: flex;
		justify-content: space-between;
		color: #999999;
		padding: 20rpx 0;
	}
</style>
