<template>
	<view class="bg">
		<view class="notice_list">
			<view class="notice_list_item" v-for="(i,index) in noticeList" :key="index" @click="routeTo(i._id)" >
				<!-- <view v-if="i.avatar">
					<image :src="i.avatar" style="width: 24px;height: 24px;border-radius: 4px;">
				</view> -->
				<view>
					<image style="width: 24px;height: 24px;border-radius: 4px;" src="@/static/ico_message.png" />
				</view>
				<view style="flex: 1;width: 90%;margin-left: 14px;">
					<view class="notice_title text-elli">{{i.title}}</view>
					<view class="notice_content text-elli-2">{{i.content}}</view>
					<view class="flex-between text-grey" style="margin-top: 10px;">
						<view class="date">{{i.publish_date}}</view>
						<!-- <view v-if="true" class="peg">未读</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="tip">已显示全部</view>
	</view>
</template>

<script>
import { timeFormat } from '@/utils/dateUtils.js';
	export default {
		data() {
			return {
				noticeList:[],
			}
		},
		onLoad() {
			this.getNoticeList()
		},
		methods: {
			routeTo(id){
				uni.navigateTo({
						url: 'notice_info?id='+id
				});
			},
			getNoticeList(){
				uni.showLoading({
					title:'请稍等...'
				})
				uniCloud.callFunction({
						name: 'get',
						data: {
							name: 'noticeGet',
						}
					}).then((res) => {
						this.noticeList = res.result.data
						for(let i in res.result.data){
							this.noticeList[i].publish_date=timeFormat(res.result.data[i].publish_date, "yyyy-MM-dd hh:mm:ss")
						}
						uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.bg{
		background-color: #FAFAFA;
		width: 100%;
	}
	.text-elli{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.text-elli-2{
		
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}

	.flex-between{
		display: flex;
		justify-content: space-between;
	}
	.text-grey{
		color: #B2B2B2;
		font-size: 12px;
	}
	.notice_list{
		border: 1px solid #FAFAFA;
		border-radius: 5px;
	}
	.notice_list_item{
		background-color: #FFF;
		border: 1px solid #fff;
		border-radius: 4px;
		margin-bottom: 14px;
		padding: 16px 14px;
		display: flex;
		margin: 14px;
	}
	.tip{
		text-align: center;
		font-size: 13px;
		color: #b2b2b2;
	}
	.peg{
		color: #2D89E5;
	}
	.notice_title {
		font-weight: bold;
		color:#333;
		font-size: 15px;
	}
	.notice_content{
		color:#999;
		font-size: 12px;
		margin-top: 5px;
	}
</style>
