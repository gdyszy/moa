<template>
	<view class="bg">
		<view v-for="(item,index) in recordList" :key="index" @click="routeTo(item._id,item.modeid)">
			<view :class="item!=0 ?'record_item':'record_item--normargin'">
				<image src="@/static/ico_page.png" class="img">
					<view class="record_item_right">
						<view class="record_item_right_title">
							<span>{{item.modename}}</span>
						</view>
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recordList: [],
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				let formData = {}
				uniCloud.callFunction({
					name: 'gongwen',
					data: {
						name: 'gwGetType',
						data: formData
					}
				}).then((res) => {
					this.recordList = res.result.data
				})
			},
			routeTo(flowid,modeid) {
				uni.navigateTo({
					url: '/pages/gongwen/index?flowid=' + flowid +'&modeid='+modeid
				});
			}
		}
	}
</script>

<style>
	* {
		-webkit-text-size-adjust: none;
	}

	.bg{
		background-color: #F4F5F7;
		width: 100%;
	}

	.record_item {
		margin-top: 5px;
		padding: 12px 14px;
		display: flex;
		background-color: #fff;
	}

	.record_item--normargin {
		padding: 12px 14px;
		display: flex;
	}

	.record_item_right_title {
		margin-left: 10px;
		display: flex;
		align-items: center;
		font-size: 15px;
		color: #333;
		font-weight: bold;
	}

	.img {
		width: 24px;
		height: 24px;
	}
</style>
