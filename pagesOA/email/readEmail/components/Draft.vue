<template>
  <view class="bottom">
    <view class="little">
      <view class="icon-box" @click="forward" >
        <image
          src="../../../../static/email/icon_picud@3x.png"
          mode="scaleToFill"
          class="forwarding-i"
        />
        转发
      </view>
      <view class="icon-box" @click="edit" >
        <image
          src="../../../../static/email/icon_edit_@3x.png"
          mode="scaleToFill"
          class="reply-i"
        />
        编辑
      </view>
      <view class="icon-box" @click="delEamil">
        <image
          src="../../../../static/email/icon_del_@3x.png"
          mode="scaleToFill"
          class="del-i"
        />
        删除
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    forward(){
       this.$emit("forward");
    },
    edit(){
       this.$emit("edit");
    },
    delEamil() {
      this.$emit("delEamil");
    },
  },
};
</script>
<style lang="less" scoped>
.bottom {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 108rpx;
  border-top: 2rpx solid rgba(242, 242, 242, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  .little {
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: space-around;
    .icon-box {
      display: flex;
      flex-direction: column;
      color: rgba(0, 0, 0, 0.7);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: center;

      .reply-i,
      .forwarding-i,
      .del-i {
        width: 56rpx;
        height: 56rpx;
      }
    }
  }
}
</style>
