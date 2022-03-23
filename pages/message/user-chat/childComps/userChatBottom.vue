<template>
  <view>
    <view class="footer">
      <!-- #ifdef APP-PLUS || H5 -->
      <image
        src="../image/ico_Emoji.png"
        class="emoji"
        @tap.stop="showBottom"
      />
      <!-- #endif -->
      <input
        type="text"
        cursor-spacing="20"
        class="inputMsg"
        v-model="content"
        @confirm="submit"
        @tap.stop="!showBottom"
        @focus="focusInput"
        @blur="blurInput"
      />
      <view
        class="sendBtn"
        :class="content.trim().length <= 0 ? 'invalid' : 'valid'"
        @tap.stop="submit"
      >
        发送
      </view>
    </view>
    <!-- #ifdef APP-PLUS || H5 -->
    <view class="emojiBox" v-show="isShow" @tap.stop="!showBottom">
      <view class="box">
        <image src="../image/ico_Emoji.png" mode=""></image>
      </view>
      <view class="box">
        <image src="../image/ico_Emoji.png" mode=""></image>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  props: {
    showB: {
      type: Boolean,
      default: false,
    },
    clearData: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    clearData: function(newVal) {
      if(newVal) this.content="";
    },
	},
  data() {
    return {
      content: "",
      isShow: this.showB,
    };
  },
  methods: {
    submit() {
      if (this.content == "") return;
      this.$emit("submit", this.content);
      this.content = "";
    },
    focusInput(e) {
      this.$emit("focusInput", e.detail.height);
    },
    blurInput() {
      this.$emit("blurInput");
    },
    showBottom() {
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.$emit("mi");
        this.$emit("func", this.isShow);
      } else {
        this.$emit("ad");
        this.$emit("func", this.isShow);
      }
      setTimeout(() => {
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 0,
        });
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../chat.css";
.footer {
  width: 100%;
}

.emojiBox {
  display: flex;
  padding: 20rpx;
  height: 300rpx;

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10rpx 20rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: #ffffff;
    border-radius: 15rpx;

    image {
      width: 80rpx;
      height: 80rpx;
    }
  }
}
</style>
