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
		   <rich-text :nodes="replaceEmoji(message.content)" class="uni-list-chat__content-note uni-ellipsis"></rich-text>
       <!-- <view>
          {{ message.content }}
        </view> -->
		    <view class="sj"></view>
      </view>
    </view>


    <view class="right-user" v-else>
      <view class="mesbox">
		  <rich-text :nodes="replaceEmoji(message.content)" class="uni-list-chat__content-note uni-ellipsis"></rich-text>
      <!--  <view>
          {{ message.content }}
        </view> -->
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
	emojiList: []
  },
  created() {
  	this.emojiList = emotionMap()
  },
  methods: {
	  //替换表情符号为图片
	  replaceEmoji(str) {
		 // console.log("str:"+str)
	  	let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
	  		for (let i = 0; i < this.emojiList.length; i++) {
	  			let row = this.emojiList[i];
	  			for (let j = 0; j < row.length; j++) {
	  				let EM = row[j];
	  				if (EM.alt == item) {
	  					//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
	  					//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
	  					let onlinePath = 'https://www.yszyun.com/emoji2x/'
	  					let imgstr = '<img style="width:20px;" src="' + onlinePath + EM.url + '">';
						//let imgstr = '<img style="width:20px;" src="/static/img/emoji/'  + EM.url + '">';
	  					//console.log("imgstr: " + imgstr);
	  					return imgstr;
	  				}
	  			}
	  		}
	  	});
	  	return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
	  },
	  onClick() {
	  	this.$emit("click");
	  }
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
