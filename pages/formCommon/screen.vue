<template>
	<view class="sub">
		<view class="content1">
			<view class="content_title">状态</view>
			<view class="selItem">
				<view class="sel" :class="cur == index?'cur':''" v-for="(item,index) in listItem" :key="index" @tap="selected(index)">{{item.status}}</view>
			</view>
		</view>
		<view class="bottom">
			<button type="default" @tap="cancel">取消</button>
			<button type="default" style="background-color: #3B89F5; color: #FFFFFF;" @tap="define">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				listItem: [
					{status:'全部',sid: 0},
					{status:'已通过',sid: 10},
					{status:'审批中',sid: 1},
					{status:'未通过',sid: 20}
				],
				cur: 0
			}
		},
		methods:{
			selected(e){
				this.cur = e
			},
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			define(){
				let a = this.listItem[this.cur].sid
				let obj = {
					sid: a,
					tabIndex: 1
				}
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.custom(obj)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style scoped>
	.sub {
		background: #F7F8FA;
		width: 100%;
	}
	.content1 {
		width: 100%;
		background-color: #FFFFFF;
		padding: 30rpx 20rpx;
	}
	.content_title {
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
	}
	.selItem {
		display: flex;
		flex-wrap: wrap;
	}
	.sel {
		border: 1px solid #cccccc;
		width: 210rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		color: #999999;
		border-radius: 4pt;
		font-size: 12pt;
		font-weight: 600;
	}
	.cur {
		color: #333333;
		background-color: #F7F8FA;;
	}
	.bottom {
	border-top: 1px solid #ccc;
	position: fixed;
	height: 140rpx;
	z-index: 1400;
	bottom: 0;
	background-color: #fff;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	}
	.bottom button {
		width: 45%;
		height: 90rpx;
		line-height: 90rpx;
		color: #333333;
		font-size: 12pt;
	}
</style>
