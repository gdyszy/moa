<template>
	<view class="content">
		<view class="flap">
			<view style="margin: 112px 14px 10px;">
				<ul class="menuList">
					<li class="menuList-item" v-for="(item,i) in menuList" :key="i" @click="routeUrl(item.route)">
						<image class="menuList-item-img" :src="item.imgUrl" >
						<span class="menuList-item-name">{{item.name}}</span>
					</li>
				</ul>
			</view>
		</view>
		<view style="padding: 0 14px;">
			<swiper style="height: 86px;" :indicator-dots="false" :autoplay="true" :interval="5000" :duration="500">
				<swiper-item v-for="(i,index) in bannerList" :key="index">
					<image class="banner" :src="i.bannerfile.url" >
				</swiper-item>
			</swiper>
		</view>
		
		<view class="notice">
			<view class="notice_head">
				<span class="notice_head_title">通知消息</span>
				<image src="@/static/workOverTime/btn_message.png" style="width: 24px;height: 24px;" @click="routeUrl('../notice/notice')">
			</view>
		</view>
		<view class="notice_body" v-for="(item, i) in noticeList" :key="i">
			<view class="notice_body_text" @click="routeUrl('../notice/notice_info?id='+item._id)">
				<view class="notice_body_text_title">{{item.title}}</view>
				<view class="notice_body_text_content">{{item.content}}</view>
			</view>
			<hr v-show="i!=noticeList.length-1" />
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList:[
					{
						name:"加班",
						imgUrl:require("@/static/ico_workOvertime.png"),
						route:"/pages/workOvertime/index"
					},{
						name:"请假",
						imgUrl:require("@/static/ico_leave.png"),
						route:"/pages/leave/index"
					},{
						name:"出差",
						imgUrl:require("@/static/ico_travel.png"),
						route:"/pages/travel/index"
					},{
						name:"外出",
						imgUrl:require("@/static/ico_goOut.png"),
						route:"/pages/goOut/index"
					},{
						name:"考勤打卡",
						imgUrl:require("../../static/ico_sign.png"),
						route:"/pages/sign/index"
					},{
						name:"补卡申请",
						imgUrl:require("@/static/ico_patchCard.png"),
						route:"/pages/patchCard/index"
					},{
						name:"日志",
						imgUrl:require("@/static/ico_daily.png"),
						route:"/pages/daily/index"
					},{
						name:"日志统计",
						imgUrl:require("@/static/ico_dailyRecord.png"),
						route:"/pages/dailyRecord/index"
					}],
					bannerList:[],
					noticeList:[]
			}
		},
		onLoad() {
			this.checkToken((res) => {//判断token 是否有效
				if(res==true){
					this.getInit()
				}else{
					
				}
			})
		},
		methods: {
			getInit(){
			this.getBanner()
			this.getNoticeList()	
			},
			routeUrl(url){
				uni.navigateTo({
						url: url
				});
			},
			getBanner(){
				uniCloud.callFunction({
					name: 'get',
					data: {
						name: 'bannerGet',
					}
				}).then((res) => {
					this.bannerList=res.result.data
			})
			},
			getNoticeList(){
				uniCloud.callFunction({
						name: 'get',
						data: {
							name: 'noticeGet',
						}
					}).then((res) => {
						this.noticeList=res.result.data
				})
			}
			
		}
	}
</script>


<style scoped>
	.content{
		width: 100%;
		background-color: #fff;
		padding: 0;
	}
	.flap{
		/* border: 1px solid #2A6DF2; */
		border-bottom-right-radius: 350px 50px;
		border-bottom-left-radius: 350px 50px;
		background: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0f215899-37db-41b7-8231-51232da1a1a3/f0ae76cd-d474-4f95-a900-5a777d37f3c0.png);
		background-size: contain;
		height: 262px;
		margin-bottom: 55px;
	}
	.swiper{
		height: 200px;
		margin-top: 60px;
	}
	.swiper-item{
		width: 100%;
		height: 200px;
	}
	.menuList{
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: center;
		background-color: #fff;
		flex-wrap: wrap;
		border: 1px solid #fff;
		border-radius: 6px;
		box-shadow: 0 1px 10px 1px #e8e8e8;
	}
	.menuList-item{
		width:18%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin:10px 0px 10px;
		padding: 3px 9px 2px;
	}
	.menuList-item-img{
		width: 42px;
		height: 42px;
	}
	.menuList-item-name{
		font-size: 12px;
		color: #333;
		margin-top: 6px;
	}
	.banner{
		width: 100%;
		height: 100%;
		border: 1px solid #fff;
		border-radius: 6px;
	}
	.notice_head{
		display: flex;
		justify-content: space-between;
	}
	.notice_head_title{
		color: #999;
		font-size: 16px;
		font-weight: bold;
		position: relative;
	}
	.notice_head_title::after{
		position: absolute;
		left: 50%;
		bottom: 0;
		margin-left: -7px;
		margin-bottom: -5px;
		content: '';
		width: 14px;
		height: 4px;
		background-color:#3B7AF5;
		border-radius: 30%;
	}
	.notice ,.notice_body{
		padding: 0 14px;
		margin-top: 18px;
	}
	.notice_body_text{
		width: 100%;
	}
	.notice_body_text_title{
		padding: 6px 20px 6px 0;
		color: #333;
		font-weight: bold;
		font-size: 15px;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.notice_body_text_content{
		margin: 6px 0 18px ;
		color: #999;
		font-size: 12px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}
</style>
