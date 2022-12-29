<template>
  <view>
    <view class="bottom-box">
      <view class="bot-top">
        <view class="bot-top-left">
          <view @click="change()" class="little-box">
            <image
              src="../../../../static/email/icon_send_@3x.png"
              mode="scaleToFill"
              class="email-icon"
            />
            <view>抄送</view>
          </view>
          <view
            @click="addPicture()"
            :class="addition == 'picture' ? 'active' : ''"
            class="little-box"
          >
            <image
              src="../../../../static/email/icon_picud_@3x.png"
              mode="scaleToFill"
              class="email-icon"
            />
            <view>图片</view>
          </view>
          <view
            @click="addAccessory()"
            :class="addition == 'accessory' ? 'active' : ''"
            class="little-box"
           v-if="showaattachment">
            <image
              src="../../../../static/email/icon_annud_@3x.png"
              mode="scaleToFill"
              class="email-icon"
            />
            <view>附件</view>
          </view>
        </view>
        <button class="send" @click="send">发送</button>
      </view>
      <transition name="fade">
        <view
          class="bot-bottom"
          v-show="addition == 'picture' || addition == 'accessory'"
        >
          <choose-picture v-show="addition == 'picture'" @picture="picture" />
          <select-file v-show="addition == 'accessory'" @file="file" />
        </view>
      </transition>
    </view>
  </view>
</template>

<script>
import ChoosePicture from "./ChoosePicture.vue";
import SelectFile from "./SelectFile.vue";
export default {
  components: { ChoosePicture, SelectFile },
  name: "Bottom",
  data() {
    return {
      addition: "",
	  showaattachment:true
    };
  },
  created() {
  	// #ifdef APP-PLUS
  	this.showaattachment =false
  	// #endif
  },
  methods: {
    picture(e) {
      this.$emit("handlePicture", e);
    },
    file(e) {
      this.$emit("handleFile", e);
    },
    //添加图片的显示
    addPicture() {
      if (this.addition == "picture") {
        this.addition = "";
      } else {
        this.addition = "picture";
      }
    },
    //添加附件的显示
    addAccessory() {
      if (this.addition == "accessory") {
        this.addition = "";
      } else {
        this.addition = "accessory";
      }
    },
    change() {
      this.$emit("change");
    },
    send() {
      this.$emit("send");
    },
  },
};
</script>

<style scoped lang="scss">
.bottom-box {
  position: fixed;
  bottom: 0;
  background: rgba(244, 245, 247, 1);
  .bot-top {
    width: 100vw;
    height: 108rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bot-top-left {
      width: 370rpx;
      height: 108rpx;
      display: flex;
      .little-box {
        width: 124rpx;
        height: 108rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        view {
          color: rgba(0, 0, 0, 0.7);
          font-family: PingFang SC;
          font-weight: 500;
          font-size: 24rpx;
          line-height: normal;
          letter-spacing: 0px;
          text-align: center;
        }
        .email-icon {
          width: 56rpx;
          height: 56rpx;
        }
      }
    }
    .send {
      width: 124rpx;
      height: 68rpx;
      border-radius: 4rpx;
      background: rgba(59, 137, 245, 1);
      color: rgba(255, 255, 255, 1);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      line-height: 68rpx;
      letter-spacing: 0px;
      text-align: center;
      margin: 0;
      margin-right: 24rpx;
    }
  }
  .bot-bottom {
    width: 100vw;
    height: 288rpx;
    padding-right: 20rpx;
  }
}

@keyframes show {
  0% {
    height: 0rpx;
  }
  100% {
    height: 288rpx;
  }
}
@keyframes hidden {
  0% {
    height: 288rpx;
  }
  100% {
    height: 0rpx;
  }
}
.active {
  background-color: #dde7e7;
}
// .fade-enter-active, .fade-leave-active {
//   transition: opacity .3s;

// }
// .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
</style>
