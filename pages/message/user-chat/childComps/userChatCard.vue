<template>
  <view class="messagebox">
	  <view class="chat-time">
	  	<text class="chat-time-text" v-if="message.chat_time">{{message.chat_time}}</text>
	  </view>


    <view class="left-user" v-if="userId !== message.from_id">
      <view class="head">
        <image :src="message.from_avatar" mode="" />
      </view>
      <view class="mesbox">
        <view>
          {{ message.content }}
        </view>
		    <view class="sj"></view>
      </view>
    </view>


    <view class="right-user" v-else>
      <view class="mesbox">
        <view>
          {{ message.content }}
        </view>
		    <view class="sj"></view>
      </view>
      <view class="head">
        <image :src="message.from_avatar" mode="" />
      </view>
    </view>

    
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      defaults: () => {},
    },
    userId: {
      type: String,
      defaults: "",
    },
  },

  data() {
    return {};
  },
  watch: {},
  computed: {},
};
</script>

<style lang="less" scoped>
* {
  word-break: break-all;
}
.messagebox {
  box-sizing: border-box;
  padding: 20rpx 20rpx;
}
.left-user {
  display: flex;
  .head {
    width: 100rpx;
    height: 100rpx;
    margin-right: 20rpx;
    image {
      width: 100rpx;
      height: 100rpx;
    }
  }
  .mesbox {
    background-color: #fff;
	  position: relative;
    .sj{
      position: absolute;
      left: -16rpx;
      top: 40rpx;
      width: 0;
      height: 0;
      border-top: 12rpx solid transparent;
      border-right: 16rpx solid #fff;
      border-bottom: 12rpx solid transparent;
      z-index: 999;
    }
  }
}

.right-user {
  display: flex;
  justify-content: flex-end;
  .head {
    width: 100rpx;
    height: 100rpx;
    margin-left: 20rpx;
    image {
      width: 100rpx;
      height: 100rpx;
    }
  }
  .mesbox {
    background-color: #9eea6a;
    position: relative;
    .sj{
      position: absolute;
      right: -16rpx;
      top: 40rpx;
      width: 0;
      height: 0;
      border-top: 12rpx solid transparent;
      border-left: 16rpx solid #9eea6a;
      border-bottom: 12rpx solid transparent;
      z-index: 999;
    }
  }
}
.head {
  border-radius: 10rpx;
  overflow: hidden;
}
.mesbox {
  max-width: 60vw;
  padding: 12rpx;
  border-radius: 10rpx;
}

.chat-time {
  margin-bottom: 0;
  font-size: 12px;
  min-height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 31px;
  margin-top: 5px;
  color: #87878a;
  white-space: normal;
}

.chat-time-txt {
  text-align: center;
  font-size: 28rpx;
  color: #8f8f8f;
}
</style>
