<template>
	<view>
		<view v-for="(item,index) in list">
			<recordItem :listData="item" @checkDetail="checkDetail" :typeFrom="typeFrom"></recordItem>
		</view>
		<view class="tips">已显示全部</view>
	</view>
</template>

<script>
	import recordItem from '../../formCommon/record.vue'
	
	export default{
		components:{
			recordItem
		},
		data(){
			return {
				formData: {
					"modeid": 1,
					"user_id":uni.getStorageSync('username'),
					"result": 0
				},
				list: [],
				typeFrom: 1
			}
		},
		props:{
			refresh: {
				type: Number,
				default: 0
			},
			filterIndex: {
				type: Number,
				default: 0
			}
		},
		watch:{
			refresh(newVal,oldVal){
				if(newVal == 1){
					this.getList()
				}
			},
			filterIndex(newVal,oldVal){
				this.formData.result = newVal
				this.getList()
			}
		},
		created() {
			this.getList()
		},
		methods:{
			checkDetail(e){
					uni.navigateTo({
						url:`/pages/formCommon/detail?id=${e.id}&type=${this.typeFrom}`
					})
			},
			getList(){
				let that = this;
				that.loading = true
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowGetList',
						data: this.formData
					}
				}).then((res) => {
					// console.log("getList res:"+JSON.stringify(res));
					that.list = res.result.data
					// console.log(that.list)
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
