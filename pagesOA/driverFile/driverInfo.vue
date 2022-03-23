<template>
  <view style="background-color: #f5f5f7">
    <view class="header">
      <view class="left-img">
        <image :src="driverFileInfo.avatar" mode="" />
      </view>
      <view class="right-info">
        <view class="name">{{ driverFileInfo.nickname }}</view>
        <view class="id">{{ driverFileInfo.username }}</view>
      </view>
    </view>
    <view class="main">
      <view class="title">人员信息</view>
      <view class="list">
        <view class="left">所属部门</view>
        <view class="right">{{ driverFileInfo.department[0].pathName }}</view>
      </view>
      <view class="list">
        <view class="left">职务</view>
        <view class="right">{{ driverFileInfo.post }}</view>
      </view>
      <view class="list">
        <view class="left">联系方式</view>
        <view class="right">{{ driverFileInfo.mobile }}</view>
      </view>
      <view class="list">
        <view class="left">驾驶证号</view>
        <view class="right">{{ driverFileInfo.driving_license }}</view>
      </view>
      <view class="list">
        <view class="left">人员状态</view>
        <view class="right">{{
          driverFileInfo.status == 0 ? "在职" : "离职"
        }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      driverFileInfo: { department: [{ departmentID: "" }] },
    };
  },
  onLoad(e) {
    let { id } = e;

    if (id) {
      this.getDriverFileInfo(id);
    }
  },
  methods: {
    getDriverFileInfo(_id) {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "car",
          data: {
            name: "getDriverDetail",
            data: {
              _id,
            },
          },
        })
        .then((res) => {
          this.driverFileInfo = res.result.data[0];
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
.header {
  height: 172rpx;
  width: 100vw;
  display: flex;
  background-color: #fff;
  .left-img {
    padding: 34rpx;
    image {
      width: 108rpx;
      height: 108rpx;
      background-color: #deecff;
      border-radius: 8rpx;
    }
  }
  .right-info {
    padding: 34rpx;
    padding-left: 0;
    .name {
      font-weight: bold;
      font-size: 38rpx;
      line-height: 54rpx;
    }
    .id {
      color: #999999;
      font-size: 28rpx;
      line-height: 40rpx;
      margin-top: 4rpx;
    }
  }
}
.main {
  padding: 0 26rpx;
  width: 100vw;
  height: 480rpx;
  margin-top: 16rpx;
  box-sizing: border-box;
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
}
</style>