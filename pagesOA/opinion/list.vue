<template>
	<view>
		<!-- 意见类型 -->
		<view class="type">
			<view class="type-item">意见类型</view>
			<uni-combox :candidates="candidates" placeholder="请选择意见类型" v-model="city"></uni-combox>
		</view>
		
		<!-- 意见描述 -->
		<view class="describe">
			<view class="describe-item">意见描述</view>
			<textarea type="textarea" placeholder="请输入意见描述" class="TextArea"></textarea>
		</view>
		
		<!-- 匿名 -->
		<uni-forms :modelValue="baseFormData">
			<uni-forms-item class="anonymity">
				<view class="describe-item">是否匿名</view>
				<uni-data-checkbox v-model="baseFormData.sex" :localdata="sexs" class="anonymity-item" />
			</uni-forms-item>
		</uni-forms>
		
		<ListInfo></ListInfo>
	</view>
</template>

<script>
	import ListInfo from './components/list-info.vue'
	export default {
		components: {
			ListInfo
		},
		data() {
			return {
				baseFormData: {
					sex: 1,
				},
				candidates: ['产品维修', '使用手册', '客服和帮助', '热门意见', '更多', '修改'],
				city: '',
				sexs: [{
					text: '是',
					value: 0
				}, {
					text: '否',
					value: 1
				}]
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	/* #endif */
	/* #ifndef APP-NVUE */
	.type {
		width: calc(100vw - 36rpx);
		padding: 0px 12px;
		.type-item {
			font-size: 30rpx;
			font-weight: medium;
			line-height: 44rpx;
			text-align: left;
		}
	}
	
	.describe {
		.TextArea {
			padding: 20rpx 25rpx;
			width: 750rpx;
			height: 224rpx;
			font-size: 32rpx;
		}
	}
	
	.describe-item {
		padding: 10rpx 25rpx;
		font-size: 30rpx;
		font-weight: medium;
		line-height: 44rpx;
		text-align: left;
	}
	
	.anonymity {
		width: 750rpx;
		height: 159rpx;
		.anonymity-item {
			padding: 0rpx 20rpx ;
		}
	}
</style>
