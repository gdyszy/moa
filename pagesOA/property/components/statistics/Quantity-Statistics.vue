<template>
	<view>
		<!-- 资产统计信息 -->
		<view class="Dataset">
			<view class="facility">
				<text class="ming">设备名称</text>
				<image class="Img" src="../../../../static/property/btn_chart_sort_1_@3x.png" mode=""></image>
				<view class="vertical"></view>
			</view>
			<view class="facility" id="facility">
				<text class="sum">在用数量</text>
				<image class="Img num" src="../../../../static/property/btn_chart_sort_2_@3x.png" mode=""></image>
			</view>
			<view class="facility">
				<text class="sum">报废数量</text>
				<image class="Img num" src="../../../../static/property/btn_chart_sort_2_@3x.png" mode=""></image>
			</view>
		</view>
		
		<!-- 设备名称 -->
		<view class="Show"  v-for="(item,index) in List" :key="index">
			<view class="Show-data">
				<view class="data-item">{{item.category_name}}</view>
				<view class="">{{item.usableNum}}</view>
				<view class="">{{item.scrapNum}}</view>
			</view>
		</view>
		<view class="tips">已显示全部</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
			        name: 'getCategoryList',
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
	.Dataset {
		width: 750rpx;
		height: 84rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color:  #F4F5F7;
		.facility {
			width: 220rpx;
			height: 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 28rpx;
			color: #000000E5;
			font-family: PingFang SC;
			font-weight: medium;
			font-size: 28rpx;
			line-height: normal;
			letter-spacing: 0rpx;
			text-align: center;
			.vertical {
				width: 2rpx;
				height: 32rpx;
				background-color: #CCCCCC;
				margin-left: 52rpx;
			}
			
		}
		.facility .sum {
			margin-left: 20rpx;
		}
		.facility .num {
			margin-right: 20rpx;
			
		}
		.Img {
			width: 48rpx;
			height: 48rpx;
			margin-left: 4rpx;
			vertical-align:middle
		}
	}
	#facility {
		border-right: 2rpx solid #CCCCCC;
	}
	
	.Show-data{
		height: 76rpx;
		display: flex;
		padding: 0rpx 28rpx;
		justify-content: space-between;
		align-items: center;
		color: #000000B2;
		font-family: PingFang SC;
		font-weight: medium;
		font-size: 28rpx;
		line-height: normal;
		letter-spacing: 0rpx;
		text-align: left;
		
		.data-item {
			width: 150rpx;
			height: 40rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	
	.Show:nth-child(odd)>.Show-data {
		background-color:  #F4F5F7;
	}
	.Show:nth-child(even)>.Show-data {
		background-color:  #FFFFFF;
	}
	// :class="[index / 2 === 0 ? 'one' : 'show']"
</style>
