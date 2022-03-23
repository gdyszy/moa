<template>
  <view class="box-border" style="background-color: #ffffff">
    <view class="baseMsg_detail">
      <view>
        <h3>流程</h3>

        <view class="baseMsg_item">
          <view class="lc">
            <view class="header">
              <view class="left_d"></view>
              <view class="user">
                <view class="carmain-right-top"
                  >提出申请<span class="carmain-name"
                    >({{ username }})</span
                  ></view
                >
              </view>
            </view>

            <view
              class="maim"
              v-for="(item, index) in flowTaskRes"
              :key="index"
            >
              <view class="left_s">
                <view class="left_s_l"></view>
              </view>
              <view class="main_right">
                <view class="left_d" v-if="item.result == 10"></view>
                <view
                  class="left_d"
                  v-if="item.result == 20"
                  style="background-color: #ee0000; border-color: #ee0000"
                ></view>
                <view
                  class="left_d"
                  v-if="item.result == 30"
                  style="background-color: #ffffff"
                ></view>

                <view class="right_name">
                  <span v-if="item.result == 10">已通过</span>
                  <span v-if="item.result == 20">已拒绝</span>
                  <span v-if="item.result == 30">待审核</span>
                  <span class="carmain-name">({{ item.nickname }})</span>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    flowTaskRes: {
      type: Array,
      defaults: () => {},
    },
    username: {
      type: String,
      defaults: "",
    },
  },
};
</script>
<style lang="less" scoped>
.baseMsg_detail {
  width: 92%;
  margin: 0 auto;
  background-color: #ffffff;
  padding-top: 30rpx;
  padding-bottom: 20rpx;
}

.baseMsg_item {
  display: flex;
  margin: 20rpx 0;
}

.lc {
  padding: 5rpx;
  padding-bottom: 20rpx;
}
.cartitle {
  font-weight: 700;
  font-size: 30rpx;
}

.header {
  padding-left: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .left_d {
    width: 16rpx;
    border: solid #1577ff 2rpx;
    height: 16rpx;
    border-radius: 16rpx;
    background-color: #1577ff;
  }
  .user {
    margin-left: 30rpx;
  }
}
.maim {
  padding-left: 6rpx;

  .left_s {
    width: 100%;
    height: 50rpx;
    position: relative;

    .left_s_l {
      position: absolute;

      border-left: solid 2px #cccccc;
      height: 68rpx;
      left: 8rpx;
      top: -8rpx;
      width: 0;
    }
  }
  .main_right {
    display: flex;

    align-items: center;
    .left_d {
      width: 16rpx;
      border: solid #1577ff 2rpx;
      height: 16rpx;
      border-radius: 16rpx;
      background-color: #1577ff;
      z-index: 10;
    }
    .right_name {
      margin-left: 32rpx;
    }
  }
}
.carmain-name {
  margin-left: 18rpx;
  color: #6e6e6e;
}
</style>