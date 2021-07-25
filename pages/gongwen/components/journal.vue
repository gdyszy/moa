<template>
	<view>
		<view v-for="(listData,index) in gwList" :key="index" @click="routeTo(listData._id,listData.user_id)">
			<view class="record">
				<view class="record_img">
					<image src="/static/workOverTime/ico_page_@2x.png" style="width: 100%; height: 100%;"></image>
				</view>
				<view style="width: 85%;">
					<view class="record_detail">
						<view class="record_detail_title">{{listData.title}}</view>

						<view class="record_detail_ico">
							<image src="/static/workOverTime/btn_message.png" style="width: 100%; height: 100%;">
							</image>
						</view>
					</view>
					<view class="record_time">
						<view>
							<text>标题:</text>
							<text>{{listData.gwtitle}}</text>
						</view>
						<view>
							<text>日期:</text>
							<text>{{listData.date_time}}</text>
						</view>
						<view>
							<text>文件字号:</text>
							<text>{{listData.fileno}}</text>
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
		</view>
		<view class="tips">已显示全部</view>
	</view>
</template>

<script>
   import {timeStamp} from '@/utils/time.js'
	export default {
		data() {
			return {
				gwList: [],
			}
		},
		props: {
			selTime: {
				type: String,
				default () {
					return '';
				}
			},
			tokenUid: {
				type: String,
				default () {
					return '';
				}
			},
			startInfo: {
				type: Object,
				default () {
					return '';
				}
			}
		},
		watch: {
			selTime(val, oldVal) {
				// if(val==this.today){
				// 	this.getList()
				// }
				// else{
				this.getList(val)
				// }
			}
		},
		filters: {
			timeStamp
		},
		mounted() {
			this.getList()
		},
		onShow() {
		this.getList()	
		},
		methods: {
			getList(date) {
				let formData = {}
				if (this.tokenUid != '') {
					formData['user_id'] = this.tokenUid
				} else {
					formData['user_id'] = uni.getStorageSync('username')
				}

				formData['modeid'] = this.startInfo.modeid
				uniCloud.callFunction({
					name: 'gongwen',
					data: {
						name: 'gwList',
						data: formData
					}
				}).then((res) => {
					this.gwList = res.result.data

				})
			},


			routeTo(id,uid){
				uni.navigateTo({
					url: '/pages/gongwen/detail?id=' +id+'&uid='+uid
				});
			}
		}
	}
</script>

<style>
	* {
		-webkit-text-size-adjust: none;
	}

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
		color: #999999;
		;
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

	.tips {
		color: #B2B2B2;
		width: 40%;
		margin: 20rpx auto;
		text-align: center;
	}
</style>
