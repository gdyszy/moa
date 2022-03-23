<template>
  <view>
    <!-- 资产管理 -->
    <view class="fixation" v-for="item in list" :key="item._id" @click="User(item._id)">
      <image src="../../../../static/property/ico_list_mob_@3x.png" mode="" style="width: 50rpx; height: 50rpx" class="image"></image>
      <text class="printer">
        {{item.category_name[0].category_name}} <text class="stick">|</text> {{ item.device_model }} </text
      ><br />
      <text class="warehouse-item">入库时间：{{ newDate(item.create_date) }}</text>
      <text class="equip">
        装备状态：<text class="use">{{ status[item.status] }}</text>
      </text>
    </view>
    <view class="Show"> 已显示全部 </view>
  </view>
</template>

<script>
// import index from './index.vue'
export default {
  // components: {
  // 	index
  // },
  data() {
    return {
      list: [],
      category: '',
      options: {
        pageSize: 10,
        pageCurrent: 1,
      },
      status: ['闲置', '使用中', '维修中', '报修'],
    };
  },
  onLoad(option) {
    // 传过来的数据
    this.GetData();
  },
  methods: {
    newDate(e) {
      let date = new Date(e);
      return date.toLocaleDateString().replace(/\//g, '-');
    },
    User(id) {
      uni.navigateTo({
        url: `message?id=${id}`,
      });
    },
    GetData() {
      const params = {
        pageSize: this.options.pageSize,
        pageCurrent: this.options.pageCurrent,
      };
      uniCloud
        .callFunction({
          name: 'property',
          data: {
            name: 'getDeviceList',
            data: params,
          },
        })
        .then((res) => {
          console.log(res.result.data);
          this.list = res.result.data;
          uni.hideLoading();
          if (res.result != null) {
            this.data = res.result.data;
            this.total = res.result.total;
          }
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false,
          });
        })
        .finally(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
// page {
//   // background-color:  #F4F5F7;
//   // background-color: #CCCCCC;
// }
.fixation {
  width: 750rpx;
  height: 192rpx;
  margin: 16rpx 0rpx 16rpx;
  background-color: #ffffff;
  position: relative;
  border-bottom: 2rpx solid #cccccc;
  .stick {
    margin: 0rpx 15rpx;
  }
  .image {
    margin: 20rpx;
    // margin-top: 20rpx;
  }
  .printer {
    position: absolute;
    left: 100rpx;
    top: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    line-height: normal;
    font-family: PingFang;
  }
  .warehouse-item {
    position: absolute;
    left: 100rpx;
    top: 75rpx;
    font-size: 24rpx;
    color: #b2b2b2;
  }
  .equip {
    position: absolute;
    left: 100rpx;
    top: 110rpx;
    font-size: 24rpx;
    color: #b2b2b2;
  }
  .use {
    color: #1e6df5;
  }
}

.Show {
  padding: 40rpx 0rpx;
  text-align: center;
  font-size: 26rpx;
  color: #b2b2b2;
  font-weight: 500;
  line-height: normal;
  font-family: PingFang;
  letter-spacing: 0rpx;
}
</style>
