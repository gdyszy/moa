<template>
  <scroll-view scroll-y="true" class="EmailBox">
    <view class="title">
      <textarea
        :value="mainData.title"
        disabled
        auto-height
        :maxlength="-1"
        class="addressee"
      />
    </view>
    <view class="nav"></view>
    <view class="name">发件人: {{ mainData.nickname }}</view>
    <view class="time" v-if="type !== 3">时间: {{getLocalTime(mainData.create_time)}}</view>
    <view class="time" v-else>时间: {{ getLocalTime(mainData.send_time) }}</view>
    <view class="addresseeName">收件人: {{setAddressName(mainData.addressee_uid)}}</view>

    <view class="line"></view>
    <view class="matter">
      <textarea v-model="mainData.content" auto-height :maxlength="-1" />
    </view>
    <view v-if="mainData.images">
      <view class="accessory-title"> 图片 </view>
      <view class="imgList">
        <view
          class="imgbox"
          v-for="(item1, index1) in mainData.images"
          :key="index1"
          @click="seeimg(item1)"
        >
          <image :src="item1.url" mode="" />
        </view>
      </view>
    </view>
    <view v-if="mainData.attachment">
      <view class="accessory-title"> 附件 </view>
      <view
        class="accessory-box"
        v-for="(item, index) in mainData.attachment"
        :key="index"
      >
        <view class="accessory-icon">
          <image
            src="../../static/email/ico_data@3x.png"
            mode="scaleToFill"
            class="icon"
          />
        </view>
        <view class="accessory-content">
          <view class="accessory-name">{{ item.name }}</view>
          <view class="accessory-mb">{{ item.size }}</view>
        </view>
        <view class="down"> 下载 </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { timeFormat } from "@/utils/dateUtils.js";
export default {
  props: {
    mainData: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
  },
  methods: {
    setAddressName(name){
      if(!name) return
      let nameArr = name.split(';');
      let str = '';
      nameArr.forEach(item=>{
        let idx = item.indexOf('|');
        str += item.slice(idx+1) + ',';
      })
      return str.slice(0,-1);
    },
    getLocalTime(nS) {
          return timeFormat(nS, "yyyy-MM-dd hh:mm");
    },
    seeimg(item) {
      wx.previewImage({
        urls: [item.url],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.addressee {
  color: rgba(0, 0, 0, 0.9);
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 34rpx;
  width: 92vw;
  line-height: 50rpx;
  font-weight: 700;
}
.EmailBox {
  margin: 12rpx 28rpx 0;
  width: calc(100vw - 56rpx);

  .nav {
    display: flex;
    margin-top: 16rpx;
  }
  .name,
  .time,
  .addresseeName {
    color: rgba(0, 0, 0, 0.57);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 26rpx;
    line-height: normal;
    letter-spacing: 1rpx;
    text-align: left;
    margin-left: 26rpx;
  }
  
  .line {
    height: 1rpx;
    background: rgba(229, 229, 229, 1);
    margin-top: 36rpx;
  }
  .matter {
    color: rgba(0, 0, 0, 0.7);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    line-height: 52rpx;
    letter-spacing: 2rpx;
    text-align: left;
    margin-top: 39rpx;
    textarea {
      width: 100%;
    }
  }
  .accessory-title {
    color: rgba(0, 0, 0, 0.9);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    line-height: normal;
    letter-spacing: 1rpx;
    text-align: left;
    margin: 80rpx 0 10rpx;
  }
  .accessory-box {
    width: calc(100vw - 60rpx);
    height: 130rpx;
    border-radius: 8rpx;
    background: rgba(255, 255, 255, 1);
    border: 2rpx solid rgba(229, 229, 229, 1);
    margin: 20rpx 0;
    display: flex;
    .accessory-icon {
      width: 112rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 60rpx;
        height: 60rpx;
      }
    }
    .accessory-content {
      width: 442rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .accessory-name,
      .accessory-mb {
        color: rgba(0, 0, 0, 0.7);
        font-family: PingFang SC;
        font-weight: 500;
        line-height: normal;
        text-align: left;
      }
      .accessory-name {
        letter-spacing: 1rpx;
        font-size: 28rpx;
      }
      .accessory-mb {
        font-size: 26rpx;
      }
    }
    .down {
      color: rgba(20, 128, 236, 1);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 26rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: left;
      width: 140rpx;
      height: 130rpx;
      text-align: center;
      line-height: 130rpx;
      position: absolute;
      right: 30rpx;
    }
  }
}
.imgList {
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  .imgbox {
    width: 25%;
    height: 154rpx;
    margin-top: 20rpx;
    image {
      display: block;
      margin: 0 auto;
      width: 154rpx;
      height: 154rpx;
    }
  }
}
</style>
