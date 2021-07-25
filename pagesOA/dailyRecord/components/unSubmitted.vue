<template>
	<view class="bg">
		<!-- <view style="margin:14px;font-size: 13px;color: #999;">{{selTime==todayDate?'今天':selTime}}</view> -->
		<view style="margin-top: 8px;background-color: #fff;">
			<view class="list" :class="index==dailyUncommittedList.length-1?'':'border-bottom'"
				v-for="(item,index) in dailyUncommittedList" :key="index" @click="routeTo(item.user_id)">
				<image src="@/static/ico_avatar.png" class="img">
					<view class="list_content">
						<view class="list_content_top">
							<view class="list_content_top_name">{{item.username}}</view>
						</view>
						<view class="list_content_bottom">暂未提交</view>
					</view>
			</view>
		</view>
		<view class="tip">已显示全部</view>
	</view>
</template>

<script>
	import {
		timeFormat
	} from '@/utils/dateUtils.js';
	export default {
		data() {
			return {
				todayDate: timeFormat(new Date(), 'yyyy-MM-dd'),
				dailyUncommittedList: []
			}
		},
		props: {
			selTime: {
				type: String,
				default () {
					return '';
				}
			},
		},
		watch: {
			selTime(newVal, oldVal) {
				var newDate = new Date(newVal).setHours(0)
				this.getList(newDate)
			}
		},
		mounted() {
			let date = new Date().setHours(0, 0, 0, 0)
			this.getList(date)
		},
		methods: {
			getList(date) {
				let formData = {
					user_id: uni.getStorageSync('username')
				}
				formData.date = date
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyRecord',
						data: formData
					}
				}).then((res) => {
					if (res.result == '无权限访问。') {
						uni.showToast({
							title: '无权限访问!',
							icon: 'none',
							duration: 1200
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							});
						}, 1300)
					} else {
						this.dailyUncommittedList = res.result.dailyUncommittedList
					}
				})
			},
			routeTo(uid){
				uni.navigateTo({
				    url: '/pagesOA/daily/index?uid='+uid+'&componentType=journal'
				});
			}
		}
	}
</script>

<style>
	.list {
		display: flex;
		padding: 14px 0;
		margin: 0 14px;
		align-items: center;
	}

	.border-bottom {
		border-bottom: 1px solid #ccc;
	}

	.list_content {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 11px;
	}
	.list_content_top_name {
		font-size: 15px;
		color: #333;
	}

	.list_content_top_name_state {
		font-size: 12px;
		color: #2D89E5;
	}

	.list_content_bottom {
		font-size: 11px;
		color: #999;
	}

	.img {
		width: 36px;
		height: 36px;
		border-radius: 4px;
	}
</style>
