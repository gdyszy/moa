<template>
	<view>
		<view class="number" @click="tabChange">
			<view>
				<image class="Img" src="../../../../static/property/ico_list_kazu_@3x.png" mode=""><text class="sum">设备数量</text></image>
			</view>
			<image class="Image" src="../../../../static/property/btn_change_@3x.png" mode=""></image>
		</view>
		<view class="number" @click="Price">
			<view>
				<image class="Img" src="../../../../static/property/ico_list_kayuu_@3x.png" mode=""><text class="sum">设备价格</text></image>
			</view>
			<image class="Image" src="../../../../static/property/btn_change_@3x.png" mode=""></image>
		</view>
		<view class="number" @click="UseStatistics">
			<view>
				<image class="Img" src="../../../../static/property/ico_list_choutai_@3x.png" mode=""><text class="sum">设备在用状态</text></image>
			</view>
			<image class="Image" src="../../../../static/property/btn_change_@3x.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			tabChange() {
				console.log(123)
				uni.navigateTo({
					url: '/pagesOA/property/components/statistics/Quantity-Statistics'
				})
			},
			Price() {
				uni.navigateTo({
					url: '/pagesOA/property/components/statistics/Price-statistics'
				})
			},
			UseStatistics(){
				uni.navigateTo({
					url: '/pagesOA/property/components/statistics/Use-statistics'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.number {
		width: calc(100vw - 48rpx);
		height: 132rpx;
		margin: 20rpx 28rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 8rpx;
		border: 2rpx solid #F0F2F7;
		position: relative;
		.sum {
			position: absolute;
			top: 40rpx;
			left: 118rpx;
			color: #000000E5;
			font-family: PingFang SC;
			font-weight: medium;
			font-size: 30rpx;
			line-height: normal;
			letter-spacing: 0rpx;
			text-align: left;
		}
		.Img {
			width: 72rpx;
			height: 72rpx;
			padding: 36rpx 0rpx 36rpx 34rpx;
		}
		.Image {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
