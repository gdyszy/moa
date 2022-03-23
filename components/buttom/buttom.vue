<template>
  <view>
    <view style="height: 140rpx"></view>
    <view class="btn" @tap="click">
      <view class="an"> {{text}} </view>
    </view>
  </view>
</template>

<script>
export default {
props: {

  text:{
    type:String,
    default:"确定"
  }
},
  
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="less" scoped>
.btn {
  border-top: 1px solid #f4f5f7;
  box-sizing: border-box;
  width: 100vw;
  height: 140rpx;
  padding: 20rpx 24rpx;
  background-color: #fff;
  color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .an {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-radius: 8rpx;
    background-color: #2b81fa;
  }
}
</style>