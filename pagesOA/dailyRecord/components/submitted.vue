<template>
	<view class="bg">
		<view style="margin:14px;font-size: 13px;color: #999;">{{selTime==todayDate?'今天':selTime}}</view>
		<view style="background-color: #fff;">
			<view class="list" :class="index==dailySubmitList.length-1?'':'border-bottom'"
				v-for="(item,index) in dailySubmitList" :key="index" @click="routeTo(item.dailyList[0]._id,item.user_id,item.dailyList[0].state)">
				<image src="@/static/ico_avatar.png" class="img">
					<view class="list_content">
						<view class="list_content_top">
							<view class="list_content_top_name">{{item.username}}</view>
						</view>
						<view class="list_content_bottom">{{item.dailyList[0].create_date}} 提交</view>
					</view>
					<view class="list_content_top_name_state" v-if="item.dailyList[0].state">未读</view>
					<view v-else></view>
					<image src="../../../static/icon_arrow_right.png" style="width: 18px;height: 18px;"></image>
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
				username:uni.getStorageSync('username'),
				todayDate:timeFormat(new Date(),'yyyy-MM-dd'),
				dailySubmitList:[],
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
		watch:{
			selTime(newVal,oldVal){
				var newDate = new Date(newVal).setHours(0)
				this.getList(newDate)
			}
		},
		mounted() {
				let date = new Date(this.selTime).setHours(0,0,0,0)
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
					if(res.result=='无权限访问。'){
						uni.showToast({
							title:'无权限访问!',
							icon:'none',
							duration:1200
						})
						setTimeout(()=>{
							uni.navigateBack({
								 delta: 2
							});
						 },1300)
					}
					else{
						this.dailySubmitList = res.result.dailySubmitList
						for(let i in this.dailySubmitList){
							this.dailySubmitList[i].dailyList[0].create_date = timeFormat(this.dailySubmitList[i].dailyList[0].create_date,'hh:mm')
							let flag = false 
							for(let j in this.dailySubmitList[i].dailyList[0].readStatus){
								if(this.dailySubmitList[i].dailyList[0].readStatus[j].user_id==this.username){
									flag = true
								}
							}
							if(flag==true){
								this.dailySubmitList[i].dailyList[0].state=false  //未读
							}
							else{
								this.dailySubmitList[i].dailyList[0].state=true  //已读
							}
						}
					}
				})
			},
			routeTo(id,uid,state){
				uni.navigateTo({
				    url: '/pagesOA/daily/detail?id='+id+'&uid='+uid+"&state="+state
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

	/* .list_content_top{display: flex;justify-content: space-between;} */
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
