<template>
	<view style="width: 100%;">
		<tab selectClass="Selfont" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :selectStatus2="selectStatus"></tab>
		<view v-show="TabCur == 0" style="height: 100%;">
			<sign></sign>
		</view>
		<view v-show="TabCur == 1" style="height: 100%;">
			<statistics @newClass="tabChange" :tabcur="TabCur"></statistics>
		</view>
	</view>
</template>

<script>
	import tab from '@/components/wuc-tab/wuc-tab.vue'
	import sign from './components/sign.vue'
	import statistics from './components/statistics.vue'
	export default {
		components:{
			tab,
			sign,
			statistics
		},
		data() {
			return {
				TabCur: 0,
				tabList: [{name: '考勤打卡'},{name: '打卡记录'}],
				selectStatus: false
			}
		},
		methods: {
			tabChange(index){
				this.TabCur = index
				this.TabCur == 1?this.selectStatus = true:this.selectStatus = false
			}
		}
	}
</script>

<style>

</style>
