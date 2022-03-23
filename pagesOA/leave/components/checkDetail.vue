<template>
	<view>
		<view v-for="(item,index) in list" :key='index'>
			<recordItem :listData="item" @checkDetail="checkDetail" :typeFrom="typeFrom"></recordItem>
		</view>
		<view class="tips">已显示全部</view>
	</view>
</template>

<script>
	import recordItem from '@/components/formCommon/record.vue'
	
	export default{
		components:{
			recordItem
		},
		data(){
			return {
				formData: {
					"modeid": 2,
					"user_id":uni.getStorageSync('username'),
					"result": 0
				},
				list: [],
				typeFrom: 2
			}
		},
		created() {
			this.getList();
		},
		props:{
			refresh: {
				type: Number,
				default: 0
			}
		},
		watch:{
			refresh(newVal){
				if(newVal == 1){
					this.getList()
				}
			}
		},
		methods:{
			checkDetail(e){
				uni.navigateTo({
					url:`/pages/formCommon/detail?id=${e.id}&type=${this.typeFrom}`
				})
			},
			async getList(){
				let res = await uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowGetList',
						data: this.formData
					}
				})
				this.list = res.result.data;
			},
			async statsToSort(sid){
				let res = await uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowGetList',
						data: this.formData
					}
				})
				this.list = res.result.data;
				this.list = this.list.filter(item=>{
					return item.result == sid
				})
			}
		}
	}
</script>

<style scoped>
	.tips {
		color: #B2B2B2;
		width: 40%;
		margin: 20rpx auto;
		text-align: center;
	}
</style>
