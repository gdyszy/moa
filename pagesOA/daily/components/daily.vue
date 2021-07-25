<template>
	<view class="bg">
		<view class="tb_item" >
			<view class="tb_item_title">当前项目名称</view>
			<view class="tb_item_input">
				<textarea v-model="formData.projectName"  type="text" placeholder="请填写项目名称" auto-height placeholder-style="color: #b2b2b2;font-size:15px;"  	/>	
			</view>
		</view>
		<view class="tb_item" >
			<view class="tb_item_title">今日工作</view>
			<view class="tb_item_input">
				<textarea v-model="formData.todayWork" type="text" placeholder="请填写工作内容" auto-height placeholder-style="color: #b2b2b2;font-size:15px;"	/>	
			</view>
		</view>
		<view class="tb_item" >
			<view class="tb_item_title">明日工作</view>
			<view class="tb_item_input">
				<textarea v-model="formData.tomorrowWork" type="text" placeholder="请填写工作安排" auto-height placeholder-style="color: #b2b2b2;font-size:15px;"  	/>
			</view>
		</view>
		<view class="tb_item" >
			<view class="tb_item_title">备注</view>
			<view class="tb_item_input">
				<textarea v-model="formData.remarks" type="text" placeholder="如有补充，请填写备注" auto-height placeholder-style="color: #b2b2b2;font-size:15px;"	/>				
			</view>
		</view>
		
		<view class="status_bar">
		<view class="btns">
			<button class="btn1" @click="reback">取消</button>
			<button class="btn2" @click="submit">提交</button>
		</view></view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				formData: {},
			}
		},
		mounted() {
			this.checkNickname((res) => {//判断昵称是否存在
				if(res==true){
					this.init()
					if(uni.getStorageSync('userInfo').length!=0 && uni.getStorageSync('userInfo').department_id){
						this.formData.department_id=uni.getStorageSync('userInfo').department_id[0]
					}
				}else{
					
				}
			})
			
		},
		methods: {
			init(){
				this.formData={
					projectName:"",
					remarks: "",
					todayWork: "",
					tomorrowWork:"",
					user_id:uni.getStorageSync('username'),
					username:uni.getStorageSync('userInfo').nickname,
					department_id:"",
					title:uni.getStorageSync('userInfo').nickname + '的日志'
				}
			},
			reback(){
				uni.navigateBack({
				    delta: 1
				});
			},
			submit(){
				let flag = this.check()
				if(flag){
					uni.showLoading({
						title:'请稍等...'
					})
					uniCloud.callFunction({
						name: 'daily',
						data: {
							name: 'dailyAdd',
							data: this.formData
						}
					}).then((res) => {
						uni.hideLoading()
						uni.showToast({
							title:'提交成功！',
							icon:'none',
						})
						this.$emit('switchTab')
					})
				}
			},
			check(){
				if(this.formData.projectName == ""){
					uni.showToast({
						icon:'none',
						title:'请填写项目名称'
					})
					return false
				}
				if(this.formData.todayWork == ""){
					uni.showToast({
						icon:"none",
						title:'请填写工作内容'
					})
					return false
				}
				if(this.formData.tomorrowWork == ""){
					uni.showToast({
						icon:"none",
						title:'请填写工作安排'
					})
					return false
				}
				else{return true}
			}
		}
	}
</script>

<style>
	.tb_item{
		padding: 14px;
		background-color: #fff;
	}
	.tb_item_title{
		color: #333;
		font-size: 13px;
	}
	.tb_item_input{
		display: flex;
		padding: 9px 0 12px;
		border-bottom: 1px solid #ccc;
	}
	.tb_item_input textarea{
		flex: 1;
	}
	.placeholder_style{
		color: #007AFF;
	}
	.tb_icon{
		width: 18px;
		height: 18px;
	}
	.status_bar {

 position: fixed;
  height: 70px;
  z-index: 1400;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
	}
	.btns{
	 display: flex;
  justify-content: center;

  color: #ffffff;
  width: 100%;
	}
	.btn1,.btn2{
		width: 300rpx;
		height: 52px;
		font-size: 15px;
		line-height: 52px;
	}
	.btn1{
		color: #666;
		background-color: #fff;
		border: 1px solid #E3E4E5;
	}
	.btn2{
		color: #fff;
		background-color: #3B89F5;
		margin-left: 13px;
	}
</style>
