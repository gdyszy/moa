<template>
<view>
    <view v-for="(item,index) in driverFileInfo" :key="index">
    <checkDeatil :title="`${item.nickname} | ${item.department[0].pathName}`" :list="list" :statusText="statusText" :listText="item.mobile" :status="item.status"  @checkDetail="checkDetail(item._id)">
    </checkDeatil>
    </view>
</view>
  
</template>

<script>

import checkDeatil from './components/checkDetail'
export default {
    components:{
			checkDeatil
		},
    data () {
        return {
            
        driverFileInfo:[],   
        list:['联系方式','人员状态'],
        statusText:['待机','出差']
            
        }
    },

    onLoad(){
        this.driverFile()
    },
    methods: {

            driverFile(){
                uni.showLoading();
				uniCloud.callFunction({
					name: 'car',
					data: {
						name: 'getDriverList',
						data: {
						}
					}
				}).then((res) => {
               this.driverFileInfo = res.result.data
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {})





            },

        checkDetail(e){
         
            uni.navigateTo({
                 url: './driverInfo?id='+e
            });
        
        }
    },

}
</script>

<style lang="less" scoped>
*{
    background-color: #f5f5f7;
    margin: 0;
    padding: 0;
}
</style>