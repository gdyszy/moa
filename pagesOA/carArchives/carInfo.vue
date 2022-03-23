<template>
  <view style="background-color: #f5f5f7">
    <view class="main">
      <view class="title">车辆信息</view>
      <view class="list">
        <view class="left">车牌号码</view>
        <view class="right">{{ carInfo.car_num }}</view>
      </view>
      <view class="list">
        <view class="left">品牌型号</view>
        <view class="right">{{ carInfo.carbrand }}</view>
      </view>
      <view class="list">
        <view class="left">座位数量</view>
        <view class="right">{{ carInfo.seat_num }}</view>
      </view>
      <view class="list">
        <view class="left">颜色</view>
        <view class="right">{{ carColor(carInfo.color) }}</view>
      </view>
      <view class="list">
        <view class="left">发动机号</view>
        <view class="right">{{ carInfo.transmitter_num }}</view>
      </view>
      <view class="list">
        <view class="left">车架号</view>
        <view class="right">{{ carInfo.frame_num }}</view>
      </view>
      <view class="list">
        <view class="left">行驶证号</view>
        <view class="right">{{ carInfo.vehicle_license }}</view>
      </view>
      <view class="list">
        <view class="left">当前状态</view>
        <view class="right">{{ carInfo.status == 1 ? "空闲" : "在用" }}</view>
      </view>
    </view>
    <view class="main" style="margin-top: 16rpx">
      <view class="title">车辆照片</view>
      <view class="carimg">
        <view
          v-for="(item, index) in carInfo.images"
          :key="index"
          @click="seeImages(item.url, index)"
        >
          <image :src="item.url" mode="" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      carInfo: {},
    };
  },
  onLoad(e) {
    let { id } = e;
    if (id) {
      this.getCarInfo(id);
    }
  },
  methods: {
    seeImages(url, index) {
      uni.previewImage({
        urls: [url],
      });
    },
    getCarInfo(_id) {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "car",
          data: {
            name: "getCarInfoDetail",
            data: {
              _id,
            },
          },
        })
        .then((res) => {
          this.carInfo = res.result.data[0];
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 26rpx;
  width: 100vw;

  background-color: #fff;
  .title {
    line-height: 80rpx;
    font-size: 34rpx;
    font-weight: 700;
  }
  .list {
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    line-height: 76rpx;
    font-size: 32rpx;

    .left {
      background-color: #fff;
      color: #000;
      opacity: 0.7;
    }
    .right {
      line-height: 76rpx;
      padding: 0;
      padding-right: 20rpx;
      font-weight: bold;
    }
  }
  .carimg {
    display: flex;
    flex-wrap: wrap;
    flex: 25%;
    image {
      height: 164rpx;
      width: 164rpx;
      margin-right: 16rpx;
      margin-top: 16rpx;
      background-color: #f2f3f5;
    }
  }
}
</style>