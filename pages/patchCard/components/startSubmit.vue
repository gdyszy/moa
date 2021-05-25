<template>
	<view>
		<from-item ref="item1" mode="picker" itemTitle="补卡时间" @dTime="dTime" :pickerType="0" />
		<from-item ref="item2" mode="textarea" itemTitle="补卡理由" placeholder="请输入" @inputVal="textVal"></from-item>
		<!-- <view class="tip">已显示全部</view> -->
		<button type="default" class="submit" @click="submit">提交</button>
	</view>
</template>

<script>
	
	import fromItem from '@/components/fromItem/index.vue'
	import { timeFormat } from '@/utils/dateUtils.js';
	
	export default {
		components:{
			fromItem
		},
		data(){
			return {
				formData: {
					"leaveid": "",
					"totals": "",
					"sericnum": "",
					"explain": "",
					"modeid": 5,
					"remarks": "",
					"result": "",
					"checksm": "",
					"start_time":"",
					"end_time":"",
					"user_id":uni.getStorageSync('username'),
					"username":uni.getStorageSync('userInfo').nickname,
					"department_id":"",
					"title":uni.getStorageSync('userInfo').nickname + '的补卡申请'
				},
				formData2: {
					"_id": '',
					"user_id":uni.getStorageSync('username')
				},
				reSetStatus: false
			}
		},
		props:{
			sid: {
				type:String,
				default: ''
			}
		},
		created() {
			this.checkNickname((res) => {//判断昵称是否存在
				if(res==true){
					let department_id = uni.getStorageSync('userInfo').department_id[0]
					if(department_id != undefined || department_id != "" || department_id != null){
						this.formData.department_id = department_id
					}
				}else{
					
				}
			})
		},
		watch:{
			id:function(newVal,oldVal){
				this.reSet(newVal)
			}
		},
		mounted() {
			if(this.sid != ''){
				this.reSet(this.sid)
			}
		},
		methods:{
			submit(){
				if(this.formData.explain == ''){
					uni.showToast({
						icon:'none',
						title:'请输入补卡理由'
					})
					return
				}
				if(this.formData.start_time == ''){
					uni.showToast({
						icon:"none",
						title:'请输入补卡时间'
					})
					return
				}
				let time1 = new Date(this.formData.start_time).getTime()
				let time2 = Date.parse(new Date())
				if(time2 < time1){
					uni.showToast({
						icon:"none",
						title:'补卡时间不能早于当前时间'
					})
					return
				}
				uni.showLoading({
					title:"请稍等..."
				})
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: "getSN"
					}
				}).then((res) => {
					 this.formData.sericnum = timeFormat(res.result, "yyyyMMdd")+res.result
					 setTimeout(() => {
					  this.submitData(this.formData)
					 }, 600)
				})
			},
			submitData(formData){
				let that = this;
				that.loading = true
				if(that.reSetStatus){
					uniCloud.callFunction({
						name: 'flow',
						data: {
							name: 'flowRemove',
							data: that.formData2
						}
					})
				}
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowAdd',
						data: formData
					}
				}).then((res) => {
					that.loading = false
					uni.hideLoading()
					that.showModal=false
					if(res.result.id){
						uni.showToast({
							title:"提交成功！"
						})
						// that.$emit('jump', {
						//     componentType: 'checkDeatil'
						// })
						that.$emit('jump', 1)
					}
				})
			},
			dTime(e){
				e.type == 0?this.formData.start_time = e.val:this.formData.end_time = e.val
			},
			textVal(e){
				this.formData.explain = e
			},
			reSet(id){
				let that = this;
				that.formData2._id = id
				uniCloud.callFunction({
					name: 'flow',
					data: {
						name: 'flowGetDetail',
						data: this.formData2
					}
				}).then((res) => {
					let data = res.result.data[0]
					that.$refs.item1.ddTime = data.start_time
					that.$refs.item2.itemVal = data.explain
					this.formData.start_time = data.start_time
					that.reSetStatus = true
				})
			}
		}
	}
</script>

<style scoped>
	.submit {
		position: fixed;
		bottom: 20pt;
		left: 0;
		right: 0;
		color: #FFFFFF;
		width: 90%;
		background-color: #3B88F5;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 12pt;
	}
	.tip {
		width: 50%;
		color: #B2B2B2;
		margin: 0 auto;
		margin-top: 12pt;
		text-align: center;
	}
</style>
