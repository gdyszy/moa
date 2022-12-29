<template>
  <view class="box">
    <!-- 设备信息 -->
    <view class="Message-item">
      <view class="back"
        >设备名称<text class="distance">{{ list.categoryName }}</text></view
      >
      <view class="back"
        >设备型号<text class="distance">{{ list.device_model }}</text></view
      >
      <view class="back"
        >购买日期<text class="distance">{{ list.buy_date }}</text></view
      >
      <view class="back"
        >价格<text class="distance">{{ list.price }}元</text></view
      >
      <view class="back"
        >收录人<text class="distance">{{ list.username }}</text></view
      >
    </view>
    <!-- 维修方式 -->
    <view class="maintain">
      <view class="back"
        >保修年限<text class="distance">{{ list.repair_year }}年</text></view
      >
      <view class="back">
        保修结束时间<text class="distance">{{ list.repair_end_date }}</text>
      </view>
      <view class="back">
        设备维护商<text class="distance">{{ list.maintainer }}</text>
      </view>
      <view class="back">
        联系方式<text class="distance">{{ list.maintainer_tel }}</text>
      </view>
    </view>
    <!-- 设备状态 点击事件@click="Tab" -->
    <view class="state">
      <view class="state-item"> 设备状态 </view>
      <view class="User">
        <text class="User-item">{{ status[list.status] }}</text>
       <!-- <image src="../../../../static/property/btn_change_@3x.png" mode=""></image> -->
      </view>
    </view>
  </view>
</template>

<script>
	import { timeFormat } from "@/utils/dateUtils.js";
export default {
  data() {
    return {
      list: '',
      status: ['闲置', '使用中', '维修中', '报修'],
    };
  },
  onLoad(options) {
    let { id } = options;
    this.GetDetailData(id);
  },
  methods: {
	  getLocalTime(nS) {
	          return timeFormat(nS, "yyyy-MM-dd");
	    },
    GetDetailData(id) {
      uniCloud
        .callFunction({
          name: 'property',
          data: {
            name: 'propertyDetail',
            data: { _id: id },
          },
        })
        .then((res) => {
          uni.hideLoading();
          if (res.result != null) {
			this.list = res.result.data[0];
			this.list.categoryName = this.list.deviceCategory[0].category_name?this.list.deviceCategory[0].category_name:""
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

.Message-item {
  width: calc(100vw - 60rpx);
  padding: 0 40rpx 0 20rpx;
}

.maintain {
  margin: 20rpx 20rpx 0rpx;
}

.back {
  width: calc(100vw - 40rpx);
  height: 60rpx;
  padding-bottom: 15rpx;
  color: #000000b2;
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 30rpx;
  line-height: normal;
  letter-spacing: 0rpx;
  text-align: left;
  position: relative;
}

.distance {
  position: absolute;
  right: 0rpx;
  color: #000000e5;
  font-family: PingFang SC;
  font-weight: bold;
  font-size: 30rpx;
  line-height: normal;
  letter-spacing: 0rpx;
  text-align: right;
}

.state {
  // width: 710rpx;
  width: calc(100vw - 40rpx);
  height: 94rpx;
  margin: 0rpx 20rpx;
  border-radius: 8rpx;
  background-color: #f4f5f7;
  display: flex;
  position: relative;
  justify-content: space-between;
  .state-item {
    color: #00000091;
    font-family: PingFang SC;
    font-weight: medium;
    font-size: 30rpx;
    line-height: normal;
    letter-spacing: 0rpx;

    margin: 26rpx 24rpx;
  }
  image {
    width: 60rpx;
    height: 60rpx;
    margin: 15rpx 5rpx 0rpx 0rpx;
  }
  .User {
    color: #1e6df5;
  }
  .User-item {
    position: absolute;
    top: 25rpx;
    right: 70rpx;
    display: inline;
    color: #1e6df5ff;
    font-family: PingFang SC;
    font-weight: bold;
    font-size: 30rpx;
    line-height: normal;
    letter-spacing: 0rpx;
    text-align: right;
  }
}
</style>
