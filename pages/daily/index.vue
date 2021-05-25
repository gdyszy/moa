<template>
	<view class="bg">
		<tab @selectMonth="selectMonth()" :seldate="seldate" selectClass="Selfont" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :selectStatus3="selectStatus"></tab>
		<view v-show="TabCur == 0" >
			<daily ref="daily" @switchTab="switchTab"></daily>
		</view>
		<view v-show="TabCur == 1">
			<journal ref="journal" @newClass="tabChange" :tokenUid="tokenUid" :selTime="selTime"></journal>
		</view>
		<month-sel-picke
		@confirm="onConfirm" 
		ref="selectMonth" ></month-sel-picke>
	</view>
</template>

<script>
	import monthSelPicke from "@/components/monthSelPicke/monthSelPicke";
	
	import { timeFormat } from '@/utils/dateUtils.js';
	
	import tab from '@/components/wuc-tab/wuc-tab.vue'
	import daily from './components/daily.vue'
	import journal from './components/journal.vue'
	export default {
		components:{
			tab,
			daily,
			journal,
			monthSelPicke
		},
		data() {
			return {
				seldate:'选择日期',
				selTime:'',
				TabCur: 0,
				tabList: [{name: '日志提交'},{name: '日志记录'}],
				selectStatus: false,
				tokenUid:''
			}
		},
		onLoad(option) {
			this.selTime = timeFormat(new Date(), "yyyy-MM-dd")
			if(option.uid !=undefined && option.componentType!=undefined){
				this.TabCur = 1
				this.tokenUid = option.uid
			}
		},
		onShow() {
			if(this.TabCur==1){
				this.$refs.journal.getList();
			}
		},
		methods: {
			tabChange(index){
				this.TabCur = index
				this.TabCur == 1?this.selectStatus = true:this.selectStatus = false
			},
			onConfirm(e){
				this.selTime=e;
				this.seldate=e;
			},
			selectMonth(){
				this.$refs.selectMonth.show();
			},
			switchTab(uid){
				this.TabCur=1;
				this.$refs.journal.getList();
				this.$refs.daily.init();
			}
		}
	}
</script>

<style>
</style>
