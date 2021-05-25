<template>
	<view>
		<view v-for="(l,index) in recordList" :key="index" >
			<view class="record_monthTime" >{{l.date}}</view>
			<view :class="i!=0 ?'record_item':'record_item--normargin'" v-for="(item,i) in l.list " :key="i" @click="routeTo(item._id,item.user_id)">
				<image src="@/static/ico_page.png" class="img">
				<view class="record_item_right" >
					<view class="record_item_right_title">
						<span>日志</span>
						<view style="width: 1px;background-color: #333;height: 15px;margin: 0 9px;"></view>
						<span>{{item.create_date}}</span>
						<span style="margin-left: 5px;">{{item.week}}</span>
					</view>
					<view class="record_item_right_content" >
						<view>
							<view class="record_item_right_content_asideText">项目名称：</view>
							<view class="record_item_right_content_asideText">今日工作：</view>
							<view class="record_item_right_content_asideText">明日工作：</view>
						</view>
						<view style="margin-left: 8px;">
							<view class="record_item_right_content_text">{{item.projectName}}</view>
							<view class="record_item_right_content_text">{{item.todayWork}}</view>
							<view class="record_item_right_content_text">{{item.tomorrowWork}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="showAll">已显示全部</view>
	</view>
</template>

<script>
	import { timeFormat } from '@/utils/dateUtils.js';
	export default {
		data() {
			return {
				today:'',
				recordList:[],
				res:[],
				dateList:[]
			}
		},
		props: {
		    selTime: {
		        type: String,
		        default() {
		            return '';
		        }
		    },
				tokenUid: {
				    type: String,
				    default() {
				        return '';
				    }
				}
		},
		watch:{
			selTime(val, oldVal){
				// if(val==this.today){
				// 	this.getList()
				// }
				// else{
					this.getList(val)
				// }
			}
		},
		mounted() {
			this.today=timeFormat(new Date(), "yyyy-MM-dd")
			this.getList()
		},
		methods: {
			getList(date){
				this.recordList = []
				this.res = []
				this.dateList=[]
				let formData = {}
				if(this.tokenUid!=''){
					formData['user_id'] = this.tokenUid
				}else{
					formData['user_id'] = uni.getStorageSync('username')
				}
				if(date && date!=''){
					var d =  date+' 00:00:00'
					//IOS日期必须是/而不支持-
					formData.date = Number(new Date(date.replace(/-/g, '/')));
				}
				uniCloud.callFunction({
					name: 'daily',
					data: {
						name: 'dailyList',
						data: formData
					}
				}).then((res) => {
					let result = [...res.result.data]
					this.res = [...result]
					
					// 格式化数据日期
					for(let i in result){
						let show_day = new Array("周日","周一","周二","周三","周四","周五","周六")
						let day = new Date(result[i].create_date).getDay()
						this.res[i].week = show_day[day]
						this.res[i].detailTime = timeFormat(res.result.data[i].create_date, "yyyy年MM月dd日")
						let timeString = timeFormat(result[i].create_date, "MM月dd日")
						let str1 =  timeString.substr(0,1)
						let str2 =  timeString.substr(1,2)
						let str3 =  timeString.substr(3,1)
						let str4 =  timeString.substr(4,2)
						str1 = str1.replace(/0/g,'')
						str3 = str3.replace(/0/g,'')
						this.res[i].create_date = str1+str2+str3+str4
					}
					// 生成 年-月 数组池
					for(let i in result){
						let yandm = result[i].detailTime.substring(0,8)
						if(this.dateList.indexOf(yandm)==-1 ){
							this.dateList.push(yandm)
						}
					}
					// 生成对象
					for(let i in this.dateList){
						let obj={
							date:this.dateList[i],
							list:[]
						}
						for (let j in result){
							if(this.dateList[i]==result[j].detailTime.substring(0,8)){
								obj.list.push(result[j])
							}
						}
						this.recordList.push(obj)
					}
				})
			},
			
			
			routeTo(id,uid){
				uni.navigateTo({
				    url: '/pages/daily/detail?id='+id+'&uid='+uid
				});
			}
		}
	}
</script>

<style>
	*{
	-webkit-text-size-adjust: none;
	}
	.record_monthTime{
		padding: 11px 0 11px 14px;
		font-size: 13px; 
		color: #999;
	}
	.record_item{
		margin-top:5px; padding: 12px 14px;display: flex;background-color: #fff;
	}
	.record_item--normargin{
		padding: 12px 14px;display: flex;background-color: #fff;
	}
	.record_item_right{
		flex: 1;
		margin-left: 11px;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.record_item_right_title{
		display: flex;align-items: center;font-size: 15px; color: #333;font-weight: bold;
	}
	.record_item_right_content{
		display: flex;margin-top: 9px;
	}
	.record_item_right_content_asideText{
		color: #999;
		font-size: 12px;
		padding: 2px 0;
	}
	.record_item_right_content_text{
		color: #666;
		font-size: 12px;
		padding: 2px 0px ;
		
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.img{
		width: 24px;
		height: 24px;
	}
	.showAll {
		color: #B2B2B2;
		margin: 20px auto 10px;
		width: 50%;
		text-align: center;
		
	}
</style>
