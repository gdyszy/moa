<template>
	<view>
		<!-- 联系 -->
		<view class="relation">
			<uni-forms class="relation-item">
				<uni-forms-item label="联系人" required></uni-forms-item>
				<textarea type="textarea" placeholder="请输入联系人"></textarea>
				<view class="way">
					<uni-forms-item label="联系方式" required></uni-forms-item>
					<textarea type="textarea" placeholder="请输入联系方式"></textarea>
				</view>
			</uni-forms>
		</view>
		
		<!-- 按钮 -->
		<view class="button">
			<button type="primary">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.button {
		width: calc(100vw - 0rpx);
	}
	button {
		display: flex;
		justify-content: center;
		left: 0;
		right: 0;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 12pt;
		color: #FFFFFF;
		background-color: #3B88F5;
		margin: 500rpx 25rpx 28rpx 25rpx ;
	}
	
	.relation {
		width: 100%;
		height: 250rpx;
		color: #E500000000;
		font-weight: meduim;
		font-size: 30rpx;
		text-align: left;
		.relation-item {
			padding: 10rpx 25rpx;
		}
		.way {
			margin-top: 5rpx;
		}
	}
	textarea {
		width: 100%;
		height: 50rpx;
		padding: 0rpx;
	}
</style>
