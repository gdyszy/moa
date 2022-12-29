<template>
  <view class="header">
    <view class="addressee-box">
      <!-- <textarea
        v-model.trim.lazy="addressInfoName.addresseeName"
        :value="returnAddressInfoName(addressInfoName.addresseeName)"
        @input="handleHead"
        disabled
        placeholder="收信人"
        auto-height
        :maxlength="-1"
        class="addressee"
      /> -->
      <textarea
        :value="returnAddressInfoName(addressInfoName.addressee)"
        disabled
        placeholder="收信人"
        auto-height
        :maxlength="-1"
        class="addressee"
      />
      <image
        src="../../../../static/email/Frame23_@3x.png"
        mode="scaleToFill"
        class="Frame"
        @click="toAdd('addressee')"
      />
    </view>
    <view class="line"></view>
    <view class="addressee-box" v-if="addressInfoName.carbonCopyStatus">
      <textarea
        :value="returnAddressInfoName(addressInfoName.carbonCopy)"
        placeholder="抄送"
        disabled
        auto-height
        :maxlength="-1"
        class="addressee"
      />
      <image
        src="../../../../static/email/Frame23_@3x.png"
        mode="scaleToFill"
        class="Frame"
        @click="toAdd('carbonCopy')"
      />
    </view>
    <view class="line" v-show="addressInfoName.carbonCopyStatus"></view>
    <textarea
      v-model="addressInfoName.theme"
      placeholder="主题"
      auto-height
      :maxlength="-1"
      placeholder-class="input-placeholder"
      class="theme"
    />

    <view class="details">
      <textarea
      v-model="addressInfoName.text"
        placeholder="输入内容"
        auto-height
        :maxlength="-1"
        class="text"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    carbonCopyStatus: {
      type: Boolean,
      default: false,
    },
    addressInfoName: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  watch: {
    carbonCopyStatus() {
      if (this.carbonCopyStatus == false) {
        this.Config.carbonCopy = "";
      }
    },
    Config() {
      this.handleHead();
    },
  },

  methods: {
    returnAddressInfoName(e) {
      let name = "";
      e.forEach((item) => {
        name += name ? `,${item.nickname}` : item.nickname;
      });
      return name;
    },

    toAdd(e) {
      this.$emit("toAdd", e);
    },
  },
};
</script>

<style scoped lang="scss">
.line {
  border-bottom: 2rpx solid rgba(229, 229, 229, 1);
  width: calc(92vw - 122rpx);
  height: 2rpx;
  margin-left: 4vw;
}
.header {
  .addressee-box {
    padding: 16rpx 4vw;
    width: 92vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .addressee {
      color: rgba(0, 0, 0, 0.9);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      width: 76vw;
      line-height: 50rpx;
    }
    .Frame {
      width: 60rpx;
      height: 60rpx;
    }
  }
  .theme {
    margin: 0 4vw;
    padding: 16rpx 0;
    width: 92vw;
    color: rgba(0, 0, 0, 0.9);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    letter-spacing: 0px;
    text-align: left;
    border-bottom: 2rpx solid rgba(229, 229, 229, 1);
    line-height: 50rpx;
  }
}
.details {
  .text {
    margin: 20rpx 4vw 0;
    width: 92vw;
    font-weight: 500;
    font-family: PingFang SC;
    font-size: 32rpx;
    line-height: 52rpx;
    letter-spacing: 0px;
    text-align: left;
    min-height: 800rpx;
  }
}
</style>
