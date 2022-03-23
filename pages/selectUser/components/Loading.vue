<template>
  <view class="dengLoadingVue">
    <view class="maskVueHiddenShow" v-if="loading">
      <view class="maskVueHiddenShowWrapper">
        <image
          src="../../../static/Loading.gif"
          class="maskVueHiddenShowWrapperGif"
        ></image>
        <view class="tips" v-if="tips">
          {{ tips }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    loading: false,
    tips: true,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scope>
.dengLoadingVue {
  .maskVueHiddenShow {
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    background-color: #fff;
    display: flex;
    justify-content: center;

    .maskVueHiddenShowWrapper {
      width: 80%;
      height: 300rpx;
      margin-top: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .maskVueHiddenShowWrapperGif {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
}
.tips {
  width: 100%;
  height: 120rpx;
  font-size: 32rpx;
  line-height: 120rpx;
  margin: 0 auto;
  text-align: center;
}
</style>