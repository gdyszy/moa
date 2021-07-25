<template>
	<view class="bg">
		<view style="height: 1px;"></view>
		<view class="calendar">
			<zzx-calendar @selected-change="datechange" @days-change="daychange" :dotList="signDateList" :unsignDotList="unsignDateList"></zzx-calendar>
		</view>
		<view class="signInfo" v-show="showInfo">
			<view class="signInfo_time">
				<view class="signInfo_time_up">
					<image class="img" :src="selItem.toWorkTime==''?require('@/static/ico_unsign.png'):selItem.toWorkNorm?require('@/static/ico_signed.png'):require('@/static/ico_abnormal_signed.png')" >
					<view class="time">
						<view class="signTime">{{selItem.toWorkTime==''?'未打卡':selItem.toWorkTime+' 打卡'}} </view>
						<view class="workTime">{{toTime}} 上班</view>
					</view>
				</view>
				<view style="display: flex;">
					<view class="arrow"></view>
					<view style="margin-left: 24px;" class="workTime" v-if="selItem.toWorkRemark!=''">{{selItem.toWorkRemark}}</view>
				</view>
				<view class="signInfo_time_down">
					<image class="img" :src="selItem.offWorkTime==''?require('@/static/ico_unsign.png'):selItem.offWorkNorm?require('@/static/ico_signed.png'):require('@/static/ico_abnormal_signed.png')" >
					<view class="time">
						<view class="unSignTime">{{selItem.offWorkTime==''?'未打卡':selItem.offWorkTime+' 打卡'}}</view>
						<view class="workTime">{{offTime}} 下班</view>
						<view class="workTime" v-if="selItem.offWorkRemark!=''">{{selItem.offWorkRemark}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tip">忘记打卡?
		 <span @click="routePatchCard">马上补卡</span>
		</view>
	</view>
</template>

<script>

	import zzxCalendar from "@/components/zzx-calendar/zzx-calendar.vue"
	import { timeFormat } from '@/utils/dateUtils.js';
	export default {
	components: {
		zzxCalendar
		},
		data() {
			return {
				formData:{
					"user_uid":uni.getStorageSync('username'),
					"monthDate":timeFormat(new Date(), "yyyy-MM")
				},
				date:{fullDate:timeFormat(new Date(), "yyyy-MM-dd")},
				selItem:{
					_id:'',				//日期
					toWorkNorm:true,  //true 打卡正常 ，false 打卡异常
					offWorkNorm:true,
					toWorkTime:'',		//上班具体时间
					offWorkTime:'',   //上班具体时间
					toWorkRemark:'',
					offWorkRemark:''
				},
				pageData:[],
				monthList:[],
				toTime:'',			//公司上班时间
				offTime:'',			//公司下班时间
				
				signDateList:[],
				unsignDateList:[],
				
				showInfo:false,
				
			}
		},
		props:{
			tabcur: {
				type: Number,
				default () {
					return 0;
				}
			},
		},
		watch: {
			tabcur(newVal, oldVal) {
				if(newVal==1){
					this.getMonthDate()
				}
			}
		},
		 mounted() {

			
			this.getMonthDate()


		
		
		},


		
	
		
		methods: {
		 getMonthDate(){
			
				
				let _this = this;
				uniCloud.callFunction({
					name: 'clockIn',
					data: {
						name: 'getClockMonthDate',
						data: _this.formData
					}
				}).then((res) => {
						
					
				
					if(res.result!=null){
					_this.toTime=res.result.startTime
					_this.offTime=res.result.endTime
					let clockList = res.result.schemeSclockList
					for(let i in clockList){
						let obj={}
						if(_this.monthList.indexOf(clockList[i]._id)==-1){
							_this.monthList.push(clockList[i]._id)
							obj['_id']=clockList[i]._id
							obj['toWorkNorm']=clockList[i].daySignList[0].clockStatus==0?true:false
							let l = clockList[i].daySignList.length
							if(l == 1){
								obj['offWorkNorm']=false
								obj['offWorkTime']=''
								obj['offWorkRemark']=''
							}else if(l>=2){
								obj['offWorkNorm']=clockList[i].daySignList[l-1].clockStatus==0?true:false
								obj['offWorkTime']=clockList[i].daySignList[l-1].clockTime.substring(0,5)
								obj['offWorkRemark']=clockList[i].daySignList[l-1].remarks?clockList[i].daySignList[l-1].remarks:''
							}
							obj['toWorkTime']=clockList[i].daySignList[0].clockTime.substring(0,5)
							obj['toWorkRemark']=clockList[i].daySignList[0].remarks?clockList[i].daySignList[0].remarks:''
							_this.pageData.push(obj)
						}
						
						let flag = true
						for(let j in clockList[i].daySignList){
							if(clockList[i].daySignList[0].clockStatus!=0 || clockList[i].daySignList.length <=1 || clockList[i].daySignList[j].clockStatus!=0){
								flag=false
							}
						}
						if(flag == true){
							let obj = {date:clockList[i]._id}
							_this.signDateList.push(obj)
						}else{
							let obj = {date:clockList[i]._id}
							_this.unsignDateList.push(obj)
						}
					}
					}
					})
					this.datechange(this.date)
			},
			datechange(e){
	
				let index = this.monthList.indexOf(e.fullDate)
			
				if(index==-1){
						this.showInfo=false
				
				}else{
					this.selItem=this.pageData[index]
					this.showInfo=true
				
				}
			},
			daychange(e){
			
				 let a =timeFormat(Number(e.start), "yyyy-MM")
				 let b =timeFormat(Number(e.end), "yyyy-MM")
				 this.formData.monthDate=a
				 this.getMonthDate();
				 if(a!=b){
					 setTimeout(()=>{
						 this.formData.monthDate=b
						 this.getMonthDate()
						 },4000)
				 }
			},
			routePatchCard(){
				uni.navigateTo({
				    url:'/pagesOA/patchCard/index'
				});
			}
		}
	}
</script>

<style>
	.bg{
		background-color: #F7F8FA;
		height: 100%;
	}
	.calendar{
		background-color: #fff;
		margin-top: 8px;
		padding-bottom: 10px;
	}
	.signInfo{
		border: 1px solid #fff;
		border-radius: 6px;
		padding: 19px 17px 21px 24px; 
		margin: 14px;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
	}
	.signInfo_time{
		flex: 1;
	}
	.signInfo_time_up,.signInfo_time_down{
		display: flex;
	}
	.signInfo_time_down{
		margin-top: 12px;
	}
	.img{
		width: 18px;
		height: 18px;
		margin-top: 4px;
	}
	.time{
		margin-left: 15px;
	}
	.signTime,.unSignTime{
		color: #333;
		font-size: 15px;
		font-weight: bold;
	}
	.signTime{
		color: #333;
	}
	.arrow{		
		width: 1px;
		min-height:22px ;
		background: #999;
		margin-left: 8px;
	}
	.workTime{
		font-size: 12px;
		color: #999;
	}
	.tip{
		margin-top: 40px;
		text-align: center;
		color: #999;
		font-size: 13px;
	}
	.tip span{
		color: #3B89F5;
		margin-left: 5px;
	}
</style>
