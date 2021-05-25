<template>
	<view class="bg">
		<view class="header">
			<view class="header_btn" @click="changeMonth('prev')">
				<image src="@/static/btn_backpage.png" class="img" >
				<span class="header_btn_text">上月</span>
			</view>
			<view style="display: flex;flex-direction: column;justify-content: center;align-items: center;" >
				<span style="color: #333;font-size: 16px;font-weight: bold;">{{nowTime}}</span>
				<span style="color: #999;font-size: 10px;" @click="selectMonth">点击切换</span>
			</view>
			<view class="header_btn" @click="changeMonth('next')">
				<span class="header_btn_text">下月</span>
				<image src="@/static/btn_nextpage.png" class="img" >
			</view>
		</view>
		<view class="body">
			<view class="body_item">
				<view class="body_item_title">出勤天数</view>
				<input class="body_item_input" :disabled="true" value="22"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">休息天数</view>
				<input class="body_item_input" :disabled="true" value="8"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">平均工时</view>
				<input class="body_item_input" :disabled="true" value="8.8"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">迟到</view>
				<input class="body_item_input" :disabled="true" value="0"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">早退</view>
				<input class="body_item_input" :disabled="true" value="0"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">缺卡</view>
				<input class="body_item_input" :disabled="true" value="0"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">请假</view>
				<input class="body_item_input" :disabled="true" value="0"/>
			</view>
			<view class="body_item">
				<view class="body_item_title">加班（小时）</view>
				<input class="body_item_input" :disabled="true" value="109"/>
			</view>
			<month-sel-picke 
			@confirm="onConfirm" 
			ref="selectMonth" ></month-sel-picke>
		</view>
		<view class="tip">已显示全部</view>
	</view>
</template>

<script>
	import monthSelPicke from "@/components/monthSelPicke/monthSelPicke";
	import { timeFormat } from '@/utils/dateUtils.js';
	export default {
		data() {
			return {
				nowTime:''
			}
		},
		components:{
			monthSelPicke
		},
		onLoad() {
			this.nowTime = timeFormat(new Date(), "yyyy-MM")
		},
		methods: {
			changeMonth(type){
				var date = this.nowTime.replace(/-/g,'/'); 
				var Y = new Date(date).getFullYear()
				var M = new Date(date).getMonth()
				if(type=='prev'){
					if(M!=0){
						this.nowTime = Y + '-';
						if(M<10){this.nowTime+='0'}
						this.nowTime += M
					}else{
						this.nowTime = Y-1 + '-';
						this.nowTime += 12;
					}
				}
				if(type=='next'){
					if(M!=11){
						this.nowTime = Y + '-';
						if(M<8){this.nowTime+='0'}
						this.nowTime += M+2
					}
					else{
						this.nowTime = Y+1 + '-';
						this.nowTime += '01';
					}
				}
			},
			onConfirm(e){
				this.nowTime=e.substring(0,7);
			},
			selectMonth(){
				this.$refs.selectMonth.show();
			}
		}
	}
</script>

<style>
	.bg{
		width: 100%;
		background-color: #F7F8FA;
	}
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px 16px;
		background-color: #fff;
	}
	.header_btn{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header_btn_text{
		font-size: 14px;
		color: #3B89F5;
		margin: 0 4px;
		font-weight: bold;
	}
	.img{
		width: 18px;
		height: 18px;
	}
	.body{
		background-color: #fff;
		margin: 8px 0 15px;
		padding: 12px 14px;
	}	
	.body_item{
		margin-bottom: 13px;
	}
	.body_item_title{
		color: #999;
		font-size: 13px;
		margin-bottom: 5px;
	}

	.body_item_input{
		padding: 0 0 12px;
		border-bottom: 1px solid #ccc;
		font-size: 15px;
		color: #333;
	}
	.tip{
		text-align: center;
		color: #b2b2b2;
		font-size: 13px;
		margin: 15px 0 46px;
	}
</style>
