<template>
  <view>
    <view class="btn">
      <Head @toAdd="toAdd" :addressInfoName="Config" />
      <Bottom
        @change="change"
        @send="send(1)"
        @handleFile="handleFile"
        @handlePicture="handlePicture"
      />
    </view>
  </view>
</template>

<script>
// import header from 'pagesOA/email/sendEmails/components/header'
import Head from "./components/Head.vue";
import Bottom from "@/pagesOA/email/sendEmails/components/Bottom";
export default {
  components: {
    Head,
    Bottom,
  },
  data() {
    return {
      haveContent: false,
      navBack: true,
      edit: false,
      Config: {
        addressee: [],
        carbonCopy: [],
        carbonCopyStatus: false,
        theme: "",
        file: "",
        picture: "",
        text: "",
      },
    };
  },
  onLoad(e) {
    if (e.type) {
      if (e.type == "reply") {
        if (e.replyUser) {
          this.Config.addressee.push(JSON.parse(e.replyUser));
          uni.setNavigationBarTitle({
            title: "回复邮件",
          });
        }
      }

      if (e.type == "forward") {
        if (e.data) {
          Object.assign(this.Config, JSON.parse(e.data));
          uni.setNavigationBarTitle({
            title: "转发邮件",
          });
        }
      }
      if (e.type == "edit") {
        if (e.data) {
          Object.assign(this.Config, JSON.parse(e.data));
          uni.setNavigationBarTitle({
            title: "编辑邮件",
          });
          this.edit = true;
        }
        if (e.user) {
          let _user = e.user;
          let a = _user.split(";");
          a.forEach((item) => {
            let i = item.split("|");
            let userData = {
              username: i[0],
              nickname: i[1],
            };
            this.Config.addressee.push(userData);
          });
        }
        if (e.addressee_copy_uid) {
          let _copyuser = e.addressee_copy_uid;
          let a = _copyuser.split(";");
          a.forEach((item) => {
            let i = item.split("|");
            let userData = {
              username: i[0],
              nickname: i[1],
            };
            this.Config.carbonCopy.push(userData);
          });
          this.Config.carbonCopyStatus = true;
        }
      }
    }
  },

  onBackPress() {
    if (this.navBack) {
      uni.showModal({
        title: "提示",
        content: "需要保存草稿箱吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.send(0);
          } else {
            this.navBack = false;
            this.goback();
          }
        },
      });
    }
    uni.redirectTo({
      url: "/pages/system/index",
    });
    return this.navBack;
  },

  methods: {
    goback() {
      uni.navigateBack({
        delta: 1,
      });
    },

    goBackSystemIndex() {
      if (
        this.Config.addressee_uid.length > 1 ||
        this.Config.theme.length > 1 ||
        this.Config.text.length > 1 ||
        this.Config.addresseeName.length > 1
      ) {
        this.haveContent = true;
      } else {
        this.$router.push("/pages/system/index");
      }
    },

    messageExit(e) {
      const target = e.target.id;
      if (target != "noexit") {
        this.haveContent = false;
      }
    },
    debounce(fn, delay) {
      let timer = null;
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(fn, delay);
      };
    },
    handleFile(e) {
      this.Config.file = e;
    },
    handlePicture(e) {
      this.Config.picture = e;
    },

    change() {
      this.Config.carbonCopyStatus = !this.Config.carbonCopyStatus;
    },
    toAdd(value) {
      this.$store.state.selectUser.selectUser = [];
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].route;
      this.$store.state.selectUser.pageRouter = curRoute;

      uni.$once("selectUser", (res) => {
        if (value == "addressee") {
          this.Config.addressee = this.$store.state.selectUser.selectUser;
        }
        if (value == "carbonCopy") {
          this.Config.carbonCopy = this.$store.state.selectUser.selectUser;
        }
      });

      if (value == "addressee") {
        this.$store.state.selectUser.selectUser = this.Config.addressee;
      } else {
        this.$store.state.selectUser.selectUser = this.Config.carbonCopy;
      }
      uni.navigateTo({
        url: `../addRecipient/index`,
      });
    },
    send(send_status) {
      let addressee_uid = "";
      let addressee_copy_uid = "";
      this.Config.addressee.forEach((item) => {
        addressee_uid += addressee_uid
          ? `;${item.username}|${item.nickname}`
          : `${item.username}|${item.nickname}`;
      });

      this.Config.carbonCopy.forEach((item) => {
        addressee_copy_uid += addressee_copy_uid
          ? `;${item.username}|${item.nickname}`
          : `${item.username}|${item.nickname}`;
      });
      let params = {
        addressee_uid, //收信人
        addressee_copy_uid, //抄送
        title: this.Config.theme, //主题
        content: this.Config.text, //内容,
        images: this.Config.picture, //图片
        attachment: this.Config.file, //附件
        send_status: send_status, //邮件发送状态
      };

        if (!this.Config.theme) {
          show_nativeUI_toast("请输入主题!", "error");
          return;
        }
      if (send_status != 0) {
        if (addressee_uid == "") {
          show_nativeUI_toast("请选择收信人!", "error");
          return false;
        }

      }

      let tip = "发送成功";
      if (send_status == 0) {
        tip = "保存成功";
      }
      uni.showLoading();
      if (this.Config._id) {
        params._id = this.Config._id;
      } else {
        this.edit = false;
      }
      uniCloud
        .callFunction({
          name: "email",
          data: {
            name: this.edit ? "emailUpdate" : "emailAdd",
            data: params,
          },
        })
        .then((res) => {
          uni.hideLoading();

          if (res) {
            if (send_status != 1) {
              show_nativeUI_toast(tip, "success");
              this.navBack = false;
              setTimeout(() => {
                uni.navigateBack({
                  delta: 2,
                });
              }, 2000);
              return;
            } else {
              show_nativeUI_toast(tip, "success");
              this.navBack = false;
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
              }, 2000);
            }
            if (res.result.id) {
              show_nativeUI_toast(tip, "success");
              this.navBack = false;
            } else {
              show_nativeUI_toast(res.result, "warn");
              return;
            }
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              });
            }, 2000);
          }
        })
        .catch((err) => {

          uni.hideLoading();
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
          this.navBack = false;
        })
        .finally(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  padding-bottom: 120rpx;
}

.navBarBox .navBar {
  width: 100rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 33rpx;
  font-weight: bold;
  margin: auto;
}

.navBarBox .logo {
  position: absolute;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 50rpx;
  left: 30rpx;
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.messageBox {
  width: 610rpx;
  height: 230rpx;
  background-color: #fff;
  border-radius: 15rpx;
  padding-top: 45rpx;
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
}

.messageText {
  margin-left: 60rpx;
  font-size: 40rpx;
}

.operationButton {
  width: 350rpx;
  height: 60rpx;
  display: flex;
  justify-content: space-around;
  margin-top: 70rpx;
  margin-left: 220rpx;
}

.operationButton text {
  color: #3a96dc;
  font-size: 30rpx;
  font-weight: bold;
  width: 140rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
}
</style>
