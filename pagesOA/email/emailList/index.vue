<template>
  <view>
    <Loading :loading="Loading" />

    <email-inbox
      :type="type"
      v-if="EmailDetails.length != 0"
      @toEmailDetails="toEmailDetails"
      @getEmailList="getEmailList"
      :list="EmailDetails"
    />
    <view class="tips" v-else> 暂无邮件 </view>
  </view>
</template>

<script>
import emailInbox from "components/email-inbox/email-inbox";
import Loading from "../../../pages/selectUser/components/Loading.vue";

export default {
  components: { emailInbox, Loading },
  data() {
    return {
      Loading: true,
      status: "read",
      EmailDetails: [],
      type: "",
      tapList: ["收件箱", "已发送", "草稿箱", "回收站"],
    };
  },
  onLoad(e) {
    this.type = e.type;
    this.getEmailList(e.type);
  },
  onShow() {
    this.getEmailList(this.type);
  },
  methods: {
    getEmailList(e) {
      this.Loading = true;
      uni.setNavigationBarTitle({
        title: this.tapList[e - 1],
      });

      //emailType  1 收件箱  2 已发送  3 草稿箱  4 回收站
      let params = {
        emailType: e, // 根据模块传不同的参数
      };
      uniCloud
        .callFunction({
          name: "email",
          data: {
            name: "getEmailList",
            data: params,
          },
        })
        .then((res) => {
          this.Loading = false;
          let _data = res.result.data;

          _data.forEach((item) => {
            item.checked = false;
          });

          if (res) {
            this.EmailDetails = _data;
          }
        })
        .catch((err) => {
          this.Loading = false;
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    toEmailDetails(e) {
      uni.navigateTo({
        url: `../readEmail/index?_id=${e._id}&type=` + this.type,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.tips {
  width: 100vw;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 32rpx;
}
</style>
