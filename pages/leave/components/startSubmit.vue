<template>
	<view class="conte">
		<from-item ref="item1" mode="select" itemTitle="请假事由" :arr="arr" @selectVal="inputVal" />
		<from-item ref="item2" v-if="TimeDate" mode="picker" itemTitle="开始时间" :dateType="dateType" @dTime="dTime" :pickerType="0" />
		<from-item ref="item3" v-if="TimeDate" mode="picker" itemTitle="结束时间" :dateType="dateType" @dTime="dTime" :pickerType="1" />
		<from-item ref="item4" v-if="TimeDate" mode="input" :itemTitle="itemTitle" placeholder="请填写" @inputVal="hourVal" />
		<from-item ref="item5" mode="textarea" itemTitle="请假原因" placeholder="请输入请假原因" @inputVal="textVal"></from-item>
		<from-item ref="item6" mode="input" itemTitle="备注" placeholder="如有补充,请填写备注" @inputVal="remarksVal" />
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
				arr: [
					  {name:'调休',msg:'按小时算',value:1,type:0},
					  {name:'年假',msg:'按半天算',value:2,type:2},
					  {name:'病假',msg:'按小时算',value:3,type:0},
					  {name:'事假',msg:'按小时算',value:4,type: 0},
					  {name:'产假',msg:'按天算',value:5,type:1},
					 ],
				itemTitle: '时长(小时)',
				dateType: 'datetime',
				formData: {
					"leaveid": 1,
					"totals": "",
					"sericnum": "",
					"explain": "",
					"modeid": 2,
					"remarks": "",
					"result": "",
					"checksm": "",
					"start_time":"",
					"end_time":"",
					"user_id":uni.getStorageSync('username'),
					"username":uni.getStorageSync('userInfo').nickname,
					"department_id":"",
					"title":uni.getStorageSync('userInfo').nickname + '的请假申请'
				},
				formData2: {
					"_id": '',
					"user_id":uni.getStorageSync('username')
				},
				reSetStatus: false,
				TimeDate: true
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
			// sid:function(newVal,oldVal){
			// 	this.reSet(newVal)
			// }
			sid: {
				immediate:true,
				handler:function(){
					if(this.sid !== ''){
						this.reSet(this.sid)
					}
				}
			}
		},
		methods:{
			submit(){
				if(this.formData.explain == ''){
					uni.showToast({
						icon:'none',
						title:'请输入请假原因'
					})
					return
				}
				if(this.formData.start_time == ''){
					uni.showToast({
						icon:"none",
						title:'请输入开始时间'
					})
					return
				}
				if(this.formData.end_time == ''){
					uni.showToast({
						icon:"none",
						title:'请输入结束时间'
					})
					return
				}
				if(this.formData.totals == ''){
					uni.showToast({
						icon:"none",
						title:'请输入时长'
					})
					return
				}
				let time1 = new Date(this.formData.start_time).getTime()
				let time2 = new Date(this.formData.end_time).getTime()
				if(this.dateType ==="halfDay"){
					let t1 = this.formData.start_time.split(' ')[0]
					let a1 = this.formData.start_time.split(' ')[1]
					time1 = new Date(t1).getTime()
					let t2 = this.formData.end_time.split(' ')[0]
					let a2 = this.formData.end_time.split(' ')[1]
					time2 = new Date(t2).getTime()
					if(time1 === time2){
						if(a1 === '上午' && a2 === '下午'){
							time1 === time2
						}else if(a1 === '下午' && a2 === '上午'){
							time1 = time1 + 1
						}
					}
				}
				if(time2 === time1 && this.dateType ==="datetime"){
					uni.showToast({
						icon:"none",
						title:'结束时间不能等于开始时间'
					})
					return
				}
				if(time2 < time1){
					uni.showToast({
						icon:"none",
						title:'结束时间不能早于开始时间'
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
			inputVal(e){
				this.formData.leaveid = this.arr[e].value
				this.itemTitle = this.arr[e].msg
				if(this.arr[e].type == 0){
					this.itemTitle = '时长(小时)'
					this.dateType = 'datetime'
				}else if((this.arr[e].type == 2)) {
					this.itemTitle = '时长(天)'
					this.dateType = 'halfDay'
				}else {
					this.itemTitle = '时长(天)'
					this.dateType = 'date'
				}
				this.formData.start_time = ''
				this.formData.end_time = ''
				this.formData.totals = ''
				this.TimeDate = false
				let that = this
				setTimeout(function () {
				  that.TimeDate = true
				}, 200);
			},
			dTime(e){
				e.type == 0?this.formData.start_time = e.val:this.formData.end_time = e.val
			},
			textVal(e){
				this.formData.explain = e
			},
			hourVal(e){
				this.formData.totals = e
			},
			remarksVal(e){
				this.formData.remarks = e
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
					if(data.leaveid === 1){
						that.itemTitle = '时长(小时)'
						that.dateType = 'datetime'
					}else if(data.leaveid === 5){
						that.itemTitle = '时长(天)'
						that.dateType = 'date'
					}else {
						that.itemTitle = '时长(天)'
						that.dateType = 'halfDay'
					}
					that.$refs.item1.selCur = data.leaveid - 1
					that.$refs.item2.ddTime = data.start_time
					that.$refs.item3.ddTime = data.end_time
					that.$refs.item4.itemVal = data.totals
					that.$refs.item5.itemVal = data.explain
					that.$refs.item6.itemVal = data.remarks
					this.formData.end_time = data.end_time
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
		/* z-index: 999; */
	}
	.tip {
		width: 50%;
		color: #B2B2B2;
		margin: 0 auto;
		margin-top: 12pt;
		text-align: center;
	}
	.conte{
		padding-bottom: 160rpx;
	}
</style>
