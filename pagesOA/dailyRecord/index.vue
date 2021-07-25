<template>
	<view class="bg">
		<tab selectClass="Selfont" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :selectStatus3="true" @selectMonth="selectMonth()"></tab>
		<view v-show="TabCur == 0" v-if="hackReset">
			<submitted :selTime="selTime" />
		</view>
		<view v-show="TabCur == 1">
			<un-submitted @newClass="tabChange" :selTime="selTime" />
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
	import submitted from './components/submitted.vue'
	import unSubmitted from './components/unSubmitted.vue'
	export default {
		components:{
			tab,
			submitted,
			unSubmitted,
			monthSelPicke
		},
		data() {
			return {
				selTime:timeFormat(new Date(),'yyyy-MM-dd'),
				TabCur: 0,
				tabList: [{name: '已提交'},{name: '未提交'}],
				selectStatus: false,
				selDateTime:'',
				hackReset:true
			}
		},
		onShow() {
			this.hackReset = false;
				this.$nextTick(() => {
					this.hackReset = true;
				})
		},
		methods: {
			tabChange(index){
				this.TabCur = index
			},
			onConfirm(e){
				this.selDateTime=e
				this.selTime=e;
			},
			selectMonth(){
				this.$refs.selectMonth.show();
			}
		}
	}
</script>

<style>
</style>
