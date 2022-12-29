<template>
  <view @click="hide" style="height: 100%">
    <scroll-view
    class="scroll-view"
      scroll-y="true"
      :class="isShow?'contentplus':'content' "
      :scroll-into-view="scrollInto"
      scroll-with-animation
    >
      <!-- 消息列表 -->
      <block v-for="(item, index) in chatList" :key="index">
        <view :id="'chat' + index">
          <user-chat-card
         :message="item"
         :userId="userId"
          />
        </view>
      </block>
    </scroll-view>
    <!-- 底部栏 -->
    <view class="footer-btn">
      <user-chat-bottom
        @submit="submit"
        @focusInput="focusInput"
        :showB="isShow"
        ref="kid"
        @ad="adds()"
        @mi="minus()"
        @down="goDown()"
        @func="getData"
		    :clearData="clearData"
      />
    </view>
  </view>
</template>

<script>
import userChatCard from "./childComps/userChatCard";
import userChatBottom from "./childComps/userChatBottom.vue";
import {formatChatTime} from '@/utils/time.js'
export default {
  components: {
    userChatCard,
    userChatBottom,
  },
  data() {
    return {
	    clearData:false,
      userId:uni.getStorageSync("userInfo")._id,
      user: {},
      scrollInto: "",
      scrollH: 0,
      chatList: [],
      isShow: false,
      timer: null,
    };
  },
  onLoad(option) {
    this.user = JSON.parse(decodeURIComponent(option.user));
    // console.log('this',this.user);
    uni.setNavigationBarTitle({
      title: this.user.nickname,
    });
    if(Object.keys(this.user).length > 0){
      this.initChatDetail();
    }else{
      uni.showToast({
        title:'参数错误',
        icon:'none'
      });
    }
  },
  onReady() {
  this.timer = setInterval(() => {//定时任务获取聊天记录
        this.initChatDetail();
    }, 1500);
  },
  onUnload(){
    // clearInterval(this.timer);
  },
  watch: {
    chatList(newVal) {
      if (newVal) {
        this.goDown();
      }
    },
  },
  methods: {
    initChatDetail(){
      let _this = this;
      let params = {
        to_id:this.user._id,//接收人id
        from_id:uni.getStorageSync("userInfo")._id// 发送人id
      };
      uniCloud.callFunction({
          name: "chat",
          data: {
            name: "getChatDetail",
            data: params,
          },
        })
        .then((res) => {
          if(res.result.code == 30203){
              uni.showToast({
                title:res.result.msg,
                icon:'none'
              });
              clearInterval(this.timer);
          }else {
            _this.chatList = res.result.data;
            for (var i = 0; i <res.result.data.length; i++) {
              _this.chatList[i].chat_time = _this.showTime(res.result.data[i].create_time,res.result.data.length);
            }
          }
        });
    },
    showTime(time) {
      return formatChatTime(time);
    },
    //发送
    submit(content) {
      let params = {
        to_id: this.user._id, //接收人to_id
        to_uid: this.user._id, //接收人to_uid
        to_name: this.user.nickname, //接收人姓名
        to_avatar: this.user.avatar, //接收人头像
        content, //消息内容
        from_name: uni.getStorageSync("userInfo").nickname, //发送人
        from_id: uni.getStorageSync("userInfo")._id, //发送人id
        from_avatar: uni.getStorageSync("userInfo").avatar, //发送人头像
        msg_type: "text", //消息类型,image 图片，text 文字 默认传text
      };
      uniCloud
        .callFunction({
          name: "chat",
          data: {
            name: "addChatDetail",
            data: params,
          },
        })
        .then(() => {
		      this.clearData=true //清空输入框内容
		      this.initChatDetail()
          this.goDown();
        });
    },
    //获取焦点时
    focusInput() {
      this.goDown();
    },
    //滚动到底部
    goDown() {
      if(!this.chatList) return;
      let lastIndex = this.chatList.length - 1;

      if (lastIndex < 0) return;
      this.scrollInto = "";
      this.$nextTick(() => {
        this.scrollInto = "chat" + lastIndex;
      });
    },
    hide() {
      if (this.isShow) {
        this.$refs.kid.showBottom();
        this.isShow = false;
      }
    },
    getData(data) {
      if (data) {
        this.isShow = data;
      }
    },
    minus() {
      this.scrollH = this.scrollH - uni.upx2px(354);
      this.goDown();
    },
    adds() {
      this.scrollH = this.scrollH + uni.upx2px(354);
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f6f7;
  height: 100%;
}

.content {
  padding: 0;
  position: fixed;
  left: 0;
  /* #ifdef H5 */
  top: 80rpx;
  height: calc(100vh - 180rpx);
  /* #endif */
  /* #ifdef APP-PLUS */
  top: 0rpx;
  height: calc(100vh - 100rpx);
  /* #endif */
  width: 750rpx;
}
  /* #ifdef MP-WEIXIN */
  .scroll-view{
    height: calc(100vh - 100rpx);
  }
  /* #endif */
.contentplus {
  padding: 0;
  position: fixed;
  left: 0;
  /* #ifdef H5 */
  top: 80rpx;
  height: calc(100vh - 520rpx);
  /* #endif */
  /* #ifdef APP-PLUS */
  top: 0rpx;
  height: calc(100vh - 440rpx);
  /* #endif */
  width: 750rpx;
}
.footer-btn {
	background-color: #f5f6f7;
  width: 750rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  // height: 100rpx;
}
</style>
