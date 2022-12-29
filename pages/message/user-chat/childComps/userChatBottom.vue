<template>
  <view>
    <view class="footer">
      <!-- #ifdef APP-PLUS || H5||MP-WEIXIN -->
      <image
        :src="imgUrl"
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
    <!-- #ifdef APP-PLUS || H5 ||MP-WEIXIN -->
    <view  v-show="isShow" @tap.stop="!showBottom">
    <swiper class="emoji-swiper" indicator-dots="true" duration="150">
    	<swiper-item v-for="(item,pid) in emojiList" :key="pid">
    		<view v-for="(em,eid) in item" :key="eid" @tap="addEmoji(em)">
    			<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
      </view>
    	</swiper-item>
    </swiper>
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
	  emojiList:emotionMap(),
	  imgUrl:require("@/static/ico_Emoji.png")
    };
  },
  methods: {
	  //添加表情
	  addEmoji(em) {
	  	this.content += em.alt;
	  },
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
 min-height: 100upx;
 background-color: #f2f2f2;
 z-index: 20;
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
.emoji-swiper {
 @media screen and (max-width: 820px) {
     height: 65vw;
	 swiper-item {
	 	display: flex;
	 	align-content: center;
    justify-content: center;
	 	flex-wrap: wrap;
	 	view {
	 		width: 15vw;
	 		height: 13vw;
	 		display: flex;
	 		justify-content: center;
	 		align-items: center;
	 		image {
	 			width: 9vw;
	 			height: 9vw;
	 		}
	 	}
	 }
    }
	@media screen and (min-width: 821px) {
	// height: 20vw;
	swiper-item {
		display: flex;
    justify-content: space-evenly;
		align-content: center;
		flex-wrap: wrap;
		view {
			width: 50px;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 50px;
				height: 50px;
			}
		}
	}
	}
	}
</style>
