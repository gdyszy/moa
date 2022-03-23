<template>
	<view class="Price">
		<view class="Price-item">
			<view class="name facility">
				<text class="name-item">设备名称</text><image class="Img" src="../../../../static/property/btn_chart_sort_1_@3x.png" mode=""></image>
			</view>
			<view class="stick"></view>
			<view class="name  distance">
				<text class="name-item">设备状态</text><image class="Img" src="../../../../static/property/btn_chart_sort_2_@3x.png" mode=""></image>
			</view>
		</view>
		<!-- 设备名称 -->
		<view class="devicename" v-for="item in List">
			<view class="devicename-item">
				<view>{{item.category_name[0].category_name}}-{{item.device_model}}</view>
				<view>{{ array[item.status] }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 array: ['闲置', '使用中', '维修中', '报废'],
				options: {
				  pageSize: 10,
				  pageCurrent: 1,
				},
				List: []
			}
		},
		onLoad() {
			 this.GetData();
		},
		methods: {
			GetData() {
			  const params = {
			    pageSize: this.options.pageSize,
			    pageCurrent: this.options.pageCurrent,
			  };
			  uniCloud
			    .callFunction({
			      name: 'property',
			      data: {
			        name: 'getDeviceList',
			        data: params,
			      },
			    })
			    .then((res) => {
			      uni.hideLoading();
			      if (res.result != null) {
			        this.List = res.result.data;
			        this.total = res.result.total;
			      }
			    })
			    .catch((err) => {
			      uni.hideLoading();
			      uni.showModal({
			        content: err.message || '请求服务失败',
			        showCancel: false,
			      });
			    })
			    .finally(() => {});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.Price {
		width: calc(100vw - 0px);
	}
	.Price-item {
		height: 84rpx;
		background-color: #F4F5F7;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.facility {
			margin: 0rpx 0rpx 0rpx 28rpx;
		}
		.name {
			width: 50%;
			.name-item {
				padding-right: 4rpx;
			}
		}
		.Img {
			width: 48rpx;
			height: 48rpx;
			vertical-align: middle;
		}
		.stick {
			width: 2rpx;
			height: 32rpx;
			background-color: #CCCCCC;
		}
		.distance {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 20rpx;
		}
	}
	
	.devicename {
		width: calc(100vw - 0rpx );
		.devicename-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0rpx 28rpx;
			height: 76rpx;
		}
		height: 76rpx;
		color: #000000B2;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 28rpx;
		line-height: normal;
		letter-spacing: 0rpx;
	}
	
	.devicename:nth-child(odd)>.devicename-item {
		background-color:  #F4F5F7;
	}
	.devicename:nth-child(even)>.devicename-item {
		background-color:  #FFFFFF;
	}
	
</style>
