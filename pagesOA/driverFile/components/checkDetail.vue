<template>
  <view>
    <view class="record" @click="checkDetail">
      <view class="left-icon">
        <view class="record_img">
          <image :src="icon"></image>
        </view>
      </view>
      <view class="right-main">
        <view class="record_detail">
          <view class="record_detail_title"
            >{{ title }}
            <view v-if="rightText" class="right-text">{{ rightText }}</view>
          </view>

          <view class="list" style="margin-top: 12rpx">
            <view class="contactInformation">{{ list[0] }}:</view>
            <view class="telephone">{{ listText }}</view>
          </view>
          <view class="list" style="margin-top: 4rpx" v-if="statusText">
            <view class="personnel">{{ list[1] }}:</view>
            <view class="state" style="color: #fa9c18" v-if="status == '0'">{{
              statusText[0]
            }}</view>
            <view class="state" style="color: #0bb58c" v-else-if="status == '1'">{{
              statusText[1]
            }}</view>
             <view class="telephone" v-else> {{listText2}} </view>
          </view>
          <!-- <slot name="main"></slot> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    listData: {
      type: Object,
      default: () => {},
    },
    rightText: {
      type: String,
      default: () => {},
    },
    title: {
      type: String,
      default: () => {},
    },
    list: {
      type: Array,
      default: () => {},
    },
    listText: {
      type: String,
      default: () => {},
    },
      listText2: {
      type: String,
      default: () => {},
    },
    statusText: {
      type: Array,
      default: () => {},
    },
    status: {
      type: Number,
      default:0 ,
    },
    icon: {
      type: String,
      default: "/static/workOverTime/ico_page_@2x.png",
    },
  },
  data() {
    return {};
  },
  methods: {
    checkDetail() {
      this.$emit("checkDetail");
    },
  },
};
</script>

<style scoped lang="less" >
.left-icon {
  width: 96rpx;
  display: flex;
  justify-content: center;

  .record_img {
    width: 40rpx;
    height: 40rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
.record {
  box-sizing: border-box;
  width: 100vw;
  height: 192rpx;
  background-color: #ffffff;
  display: flex;
  padding: 32rpx 0;
  margin-top: 16rpx;
}

.record_detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .list {
    color: #000000;
    opacity: 0.6;
    line-height: 36rpx;
    font-size: 24rpx;
    display: flex;
    .contactInformation,
    .personnel {
      width: 124rpx;
    }
  }
}

.record_detail_title {
  display: flex;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 44rpx;
  width: 82vw;
  position: relative;

  .right-text {
    position: absolute;
    font-weight: 500;
    line-height: 44rpx;
    font-size: 28rpx;
    color: #1e7ff5;
    right: 0rpx;
    top: 0rpx;
  }
}
.right-main {
  width: calc(100vw-96rpx);
  height: 100%;
}
</style>
