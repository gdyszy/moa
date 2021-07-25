<template>
	<view>
		<view class="header">
			<view class="header_img">
				<image src="../../static/workOverTime/ico_avator_@2x.png" style="width: 100%; height: 100%;"></image>
			</view>
			<view style="width: 80%;">
				<view class="header_name">{{listDetail.title}}</view>
				<view class="header_status">
					<view v-if="listDetail.result == 1">申请状态: 审批中</view>
					<view v-if="listDetail.result == 10">申请状态: 已审批</view>
					<view v-if="listDetail.result == 20">申请状态: 未通过</view>
					<view v-if="listDetail.result == 30">申请状态: 待审批</view>
				</view>
			</view>
		</view>
		<view class="baseMsg">
			<view class="baseMsg_header">
				<view class="baseMsg_header_img">
					<image src="../../static/workOverTime/ico_page_@2x.png" style="width: 100%; height: 100%;"></image>
				</view>
				<view class="baseMsg_header_title">
					基础信息
				</view>
			</view>
			<view class="baseMsg_item">
				<view class="baseMsg_item_title">申请人</view>
				<view class="baseMsg_content">{{listDetail.username}}</view>
			</view>
			<view class="baseMsg_item">
				<view class="baseMsg_item_title">所在部门</view>
				<view v-if="department" class="baseMsg_content">{{department.name}}</view>
				<!-- #ifdef MP-WEIXIN -->
					<view v-if="department.length == 0">无</view>
				<!-- #endif -->
				<view v-if="!department">无</view>
			</view>
			<view class="baseMsg_item">
				<view class="baseMsg_item_title">申请类型</view>
				<view v-if="type==1" class="baseMsg_content">加班申请</view>
				<view v-if="type==2" class="baseMsg_content">{{leaveTitle}}申请</view>
				<view v-if="type==3" class="baseMsg_content">出差申请</view>
				<view v-if="type==4" class="baseMsg_content">外出申请</view>
				<view v-if="type==5" class="baseMsg_content">补卡申请</view>
			</view>
			<view class="baseMsg_item">
				<view class="baseMsg_item_title">申请时间</view>
				<view class="baseMsg_content">{{listDetail.create_date | yearMonthDateMin}}</view>
			</view>
		</view>
		<view style="background-color: #FFFFFF; padding-bottom: 20rpx;">
			<view class="baseMsg_detail">
				<view class="baseMsg_header">
					<view class="baseMsg_header_img">
						<image src="../../static/workOverTime/ico_page_@2x.png" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="baseMsg_header_title">
						详情信息
					</view>
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title" v-if="type==1">加班事项</view>
					<view class="baseMsg_item_title" v-if="type==2">请假事项</view>
					<view class="baseMsg_item_title" v-if="type==3">出差事项</view>
					<view class="baseMsg_item_title" v-if="type==4">外出事项</view>
					<view class="baseMsg_item_title" v-if="type==5">补卡理由</view>
					<view class="baseMsg_content">{{listDetail.explain}}</view>
				</view>
				<template v-if="type != 5">
					<view>
						<view class="baseMsg_item">
							<view class="baseMsg_item_title">开始时间</view>
							<view class="baseMsg_content">{{listDetail.start_time}}</view>
						</view>
						<view class="baseMsg_item">
							<view class="baseMsg_item_title">结束时间</view>
							<view class="baseMsg_content">{{listDetail.end_time}}</view>
						</view>
						<view class="baseMsg_item">
							<view v-if="type==1 || type == 4 || type == 5" class="baseMsg_item_title">
								<view>时长(小时)</view>
							</view>
							<view v-else-if="type == 3" class="baseMsg_item_title">
								<view>出差天数</view>
							</view>
							<view v-else-if="type == 2" class="baseMsg_item_title">
								<view v-if="listDetail.leaveid == 1 || listDetail.leaveid == 3 || listDetail.leaveid == 4">时长(小时)</view>
								<view v-if="listDetail.leaveid == 2 || listDetail.leaveid == 5">时长(天)</view>
							</view>
							<view class="baseMsg_content">{{listDetail.totals}}</view>
						</view>
						<view class="baseMsg_item">
							<view class="baseMsg_item_title">备注</view>
							<view v-if="listDetail.remarks" class="baseMsg_content">{{listDetail.remarks}}</view>
							<view v-else class="baseMsg_content">无</view>
						</view>
					</view>
				</template>
				<template v-if="type == 5">
					<view>
						<view class="baseMsg_item">
							<view class="baseMsg_item_title">补卡时间</view>
							<view class="baseMsg_content">{{listDetail.start_time}}</view>
						</view>
					</view>
				</template>
				
			</view>
		</view>
		<view style="background-color: #FFFFFF; padding-bottom: 20rpx;"  v-if="listDetail.result ==10 || listDetail.result ==20">
			<view class="baseMsg_detail">
				<view class="baseMsg_header">
					<view class="baseMsg_header_img">
						<image src="../../static/workOverTime/ico_page_@2x.png" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="baseMsg_header_title">
						审批信息
					</view>
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">审批人</view>
					<view class="baseMsg_content">{{listDetail.optname}}</view>
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">审批时间</view>
					<view class="baseMsg_content">{{listDetail.audit_time | yearMonthDateMin}}</view>
				</view>
				<view class="baseMsg_item">
					<view class="baseMsg_item_title">审批意见</view>
					<view class="baseMsg_item_text baseMsg_content" v-if="listDetail.checksm">{{listDetail.checksm}}</view>
					<view v-else class="baseMsg_content">无</view>
				</view>
			</view>
		</view>
		<!-- <view class="showAll">已显示全部</view> -->
			<view :class="listDetail.result == 10 || listDetail.result == 20 ? 'hideBtn':''">
				<view class="bottom" v-if="!hasAuth">
					<view class="bottom_btn" @tap="revise">
						<view class="bottom_ico"><image src="../../static/workOverTime/ico_revise.png" style="width: 100%; height: 100%;"></image></view>
						<view class="bottom_text">修改</view>
					</view>
					<view class="bottom_btn" @tap="openPopup">
						<view class="bottom_ico"><image src="../../static/workOverTime/ico-cancel.png" style="width: 100%; height: 100%;"></image></view>
						<view class="bottom_text">撤销</view>
					</view>
				</view>
				<view class="bottom" v-if="hasAuth">
					<view class="bottom_btn" @tap="adpot(1)">
						<view class="bottom_ico"><image src="../../static/workOverTime/ico-cancel.png" style="width: 100%; height: 100%;"></image></view>
						<view class="bottom_text">驳回</view>
					</view>
					<view class="bottom_btn" @tap="adpot(0)">
						<view class="bottom_ico"><image src="../../static/workOverTime/pass.png" style="width: 100%; height: 100%;"></image></view>
						<view class="bottom_text">通过</view>
					</view>
				</view>
			</view>
		
		<uni-popup type="bottom" ref="popup">
			 <view class="pop">
				<view class="pop_title">确认撤回申请吗?</view>
				<view class="pop_title" style="color: #2D89E5;" @tap="revoke">撤回</view>
				<view class="pop_title" style="color: #666666; border-top: 4px solid #F4F5F7;" @tap="close">取消</view>
			 </view>
		</uni-popup>
	</view>
</template>

<script>
	import {yearMonthDateMin} from '@/utils/time.js'
	
	export default {
		data(){
			return {
				type: 0,
				formData: {
					"_id": '',
					"user_id":uni.getStorageSync('username')
				},
				listDetail: {},
				department: [],
				hasAuth: false,
				leaveTitle: '请假'
			}
		},
		onLoad(option) {
			this.formData._id = option.id
			this.type = option.type
		},
		filters:{
			yearMonthDateMin
		},
		 created() {
			 this.getDetail()
			 this.hasApproAuth()
		 },
		 methods:{
			async getDetail(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let that = this;
				that.loading = true
				await uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowGetDetail',
						data: this.formData
					}
				}).then((res) => {
					that.listDetail = res.result.data[0]
					that.department = that.listDetail.department[0]
					let leaveid = this.listDetail.leaveid
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
					uni.hideLoading()
					
				})
			},
			adpot(n){
				uni.navigateTo({
					url:`/pages/formCommon/adpot?status=${n}&id=${this.formData._id}`
				})
			},
			revoke(){
				let that = this
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowRemove',
						data: this.formData
					}
				}).then((res) => {
					this.$refs.popup.close()
					let obj = {
						sid: 0,
						tabIndex: 1
					}
					let pages = getCurrentPages()
					let beforePage = pages[pages.length - 2]
					beforePage.$vm.custom(obj)
					uni.navigateBack({
						delta:1
					})
				})
			},
			close(){
				this.$refs.popup.close()
			},
			openPopup(){
				this.$refs.popup.open()
			},
			revise(){
				let obj = {
					tabIndex: 0,
					id: this.formData._id
				}
				let pages = getCurrentPages()
				let beforePage = pages[pages.length - 2]
				beforePage.$vm.resvise(obj)
				uni.navigateBack({
					delta:1
				})
			},
			hasApproAuth(){
				let that = this
				uniCloud.callFunction({
					name: "department",
					data: {
						name: "hadApprovalAuth",
						user_id: uni.getStorageSync('username')
					}
				}).then((res)=>{
					if(res.result.data.length != 0){
						that.hasAuth = true
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
		display: block;
	}
</style>
<style scoped>
	.header {
		background-color: #FFFFFF;
		padding: 30rpx;
		display: flex;
		margin-bottom: 20rpx;
	}
	.header_img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}
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
		width: 58rpx;
		height: 58rpx;
		margin-right: 20rpx;
	} 
	.baseMsg_header_title {
		font-weight: bold;
		font-size: 34rpx;
	}
	.baseMsg_item {
		display: flex;
		margin: 20rpx 0;
	}
	.baseMsg_item_title {
		color: #999999;
		width: 200rpx;
	}
	.baseMsg_detail {
		border-top: 1px solid #E5E5E5;
		width: 92%;
		margin: 0 auto;
		background-color: #FFFFFF;
		padding-top: 30rpx;
	}
	.showAll {
		color: #B2B2B2;
		margin: 0 auto;
		width: 50%;
		text-align: center;
		margin-top: 40rpx;
	}
	.bottom {
		background-color: #FFFFFF;
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: space-around;
	}
	.bottom_ico {
		width: 48rpx;
		height: 48rpx;
		margin: 0 auto;
	}
	.bottom_btn {
		align-items: center;
		padding: 20rpx;
	}
	.bottom_text {
		font-size: 24rpx;
		color: #999999;
	}
	.baseMsg_item_text {
		width: 500rpx;
	}
	.hideBtn {
		display: none;
	}
	.pop {
		/* height: 400rpx; */
		width: 100%;
		background-color: #FFFFFF;
	}
	.pop_title {
		color: #999999;
		text-align: center;
		width: 100%;
		padding: 40rpx 0;
		border-bottom: 1px solid #F4F5F7;
	}
	.baseMsg_content {
		width: 700rpx;
	}
</style>
