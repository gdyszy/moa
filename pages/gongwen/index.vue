<template>
	<view class="bg">
		<tab @selectMonth="selectMonth()" :seldate="seldate" selectClass="Selfont" :tab-list="tabList"
			:tabCur.sync="TabCur" @change="tabChange"></tab>
		<view v-show="TabCur == 0">
			<start ref="start" @change="tabChange(1)" @switchTab="switchTab" :startInfo="startInfo"></start>
		</view>
		<view v-show="TabCur == 1">
			<journal ref="journal" @newClass="tabChange" :startInfo="startInfo" :tokenUid="tokenUid" :selTime="selTime">
			</journal>
		</view>
		<month-sel-picke @confirm="onConfirm" ref="selectMonth"></month-sel-picke>
	</view>
</template>

<script>
	import monthSelPicke from "@/components/monthSelPicke/monthSelPicke";
	import {
		timeFormat
	} from '@/utils/dateUtils.js';
	import tab from '@/components/wuc-tab/wuc-tab.vue'
	import start from './components/start.vue'
	import journal from './components/journal.vue'
	export default {
		components: {
			tab,
			start,
			journal,
			monthSelPicke
		},
		data() {
			return {
				seldate: '选择日期',
				selTime: '',
				TabCur: 0,
				tabList: [{
					name: '发起公文'
				}, {
					name: '公文记录'
				}],
				selectStatus: false,
				tokenUid: '',
				startInfo: {}
			}
		},
		onLoad(option) {
			console.log("this.TabCur:" + JSON.stringify(option))
			this.startInfo = option
			this.selTime = timeFormat(new Date(), "yyyy-MM-dd")
			if (option.uid != undefined && option.componentType != undefined) {
				this.TabCur = 1
				this.tokenUid = option.uid
			}
			if (option.modeid == 2) {
				this.tabList = [{
					name: '发起收文'
				}, {
					name: '收文记录'
				}]
				setTimeout(() => {
					uni.setNavigationBarTitle({
						title: '发起收文'
					})
				}, 300)
			}
		},
		onShow() {
			if (this.TabCur == 1) {
				this.$refs.journal.getList();
			}
		},
		methods: {
			onPullDownRefresh() {
				if (this.TabCur == 1) {
					this.$refs.journal.getList();
				}
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			tabChange(index) {
				this.TabCur = index
				if (index == 1) {
					this.$refs.journal.getList();
				}
				this.TabCur == 1 ? this.selectStatus = true : this.selectStatus = false
			},
			onConfirm(e) {
				this.selTime = e;
				this.seldate = e;
			},
			selectMonth() {
				this.$refs.selectMonth.show();
			},
			switchTab(uid) {
				this.TabCur = 1;
				this.$refs.journal.getList();
				this.$refs.start.init();
			}
		}
	}
</script>

<style>
</style>
