<template>
	<view>
		<tab selectClass="Selfont" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :selectStatus="selectStatus"></tab>
		<view v-if="TabCur == 0">
			<start-submit @jump="tabChange" :sid="id"></start-submit>
		</view>
		<view v-if="TabCur == 1">
			<check-deatil :refresh="TabCur" ref="checkDetail"></check-deatil>
		</view>
	</view>
</template>

<script>
	import tab from '@/components/wuc-tab/wuc-tab.vue'
	import startSubmit from './components/startSubmit.vue'
	import checkDeatil from './components/checkDetail.vue'
	import getLogin from '@/mixins/index.js'
	
	export default {
		components:{
			tab,
			startSubmit,
			checkDeatil
		},
		data(){
			return {
				TabCur: 0,
				tabList: [{name: '提交申请'},{name: '申请记录'}],
				selectStatus: false,
				id: ''
			}
		},
		mixins:[getLogin],
		methods:{
			tabChange(index){
				this.TabCur = index
				this.TabCur == 1?this.selectStatus = true:this.selectStatus = false
			},
			custom(obj){
				this.TabCur = obj.tabIndex;
				this.$refs.checkDetail.statsToSort(obj.sid);
			},
			resvise(e){
				this.TabCur = e.tabIndex
				this.id = e.id
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
		display: block;
	}
</style>
