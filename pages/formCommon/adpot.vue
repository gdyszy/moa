<template>
	<view>
		<view class="adpot">
			<view>处理结果</view>
			<view class="adpot_content">
				<view class="adpot_item" @tap="selAdpot(0)">
					<image class="adpot_ico" v-show="status == 0" src="../../static/workOverTime/btn-next@2x.png"></image>
					<image class="adpot_ico" v-show="status == 1" src="../../static/workOverTime/btn-next@2x-1.png"></image>
					<text>通过</text>
				</view>
				<view class="adpot_item" style="margin-left: 80rpx;" @tap="selAdpot(1)">
					<image class="adpot_ico" v-show="status == 1" src="../../static/workOverTime/btn-next@2x.png"></image>
					<image class="adpot_ico" v-show="status == 0" src="../../static/workOverTime/btn-next@2x-1.png"></image>
					<text>驳回</text>
				</view>
			</view>
			<view>审批意见</view>
			<view class="inputView" style="padding: 20rpx 0;">
				<textarea v-model="formData.checksm" maxlength="70" placeholder-style="color:#B3B3B3" placeholder="请输入审批意见" />
			</view>
		</view>
		<view class="bottom">
			<button type="default" @tap="cancel">取消</button>
			<button type="default" style="background-color: #3B89F5; color: #FFFFFF;" @tap="agree">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				status: 0,
				formData: {
					"_id": '',
					"user_id":uni.getStorageSync('username'),
					"result": 1,
					"checksm": ''
				},
			}
		},
		onLoad(options) {
			this.status = options.status
			this.formData._id = options.id
			this.formData.optname = uni.getStorageSync('userInfo').nickname
		},
		methods:{
			selAdpot(n){
				this.status = n
			},
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			agree(){
				if(this.status == 0){
					this.formData.result = 10
				}else if(this.status == 1){
					this.formData.result = 20
				}
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowUpdata',
						data: this.formData
					}
				}).then((res)=> {
					let obj = {
						sid: 0,
						tabIndex: 1
					}
					let pages = getCurrentPages()
					let beforePage = pages[pages.length - 3]
					beforePage.$vm.custom(obj)
					uni.navigateBack({
						delta:2
					})
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
	.adpot{
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 20rpx;
	}
	.adpot_ico {
		width: 38rpx;
		height: 38rpx;
		margin-right: 15rpx;
	}
	.adpot_item {
		display: flex;
		align-items: center;
	}
	.adpot_content{
		display: flex;
		padding: 30rpx 0;
	}
	.inputView {
		padding: 30rpx 0;
		border-bottom: 1px solid #CCCCCC;
		margin: 0 auto;
		width: 100%;
		margin-bottom: 20rpx;
	}
	.inputView textarea {
		line-height: 40rpx;
		height: 120rpx;
		width: 100%;
	}
	.bottom {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		display: flex;
	}
	.bottom button {
		width: 44%;
		height: 90rpx;
		line-height: 90rpx;
		color: #333333;
		font-size: 12pt;
	}
</style>
