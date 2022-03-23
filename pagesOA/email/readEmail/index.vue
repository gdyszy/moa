<template>
  <view>
    <Loading :loading="Loading" />
    <Email :mainData="mainData" />
    <Read
      @delEamil="tips"
      @reply="reply"
      @forward="forward"
      v-if="type == '1'"
    />
    <Draft
      @delEamil="tips"
      @edit="edit"
      @forward="forward"
      v-if="type == '3'"
    />
    <Del
      @delEamil="tips"
      @reply="reply"
      @forward="forward"
	  @recovery="recovery"
      v-if="type == '4'"
    />
  </view>
</template>

<script>
import Email from "../../../components/email/email.vue";
import Loading from "../../../pages/selectUser/components/Loading.vue";
import Read from "./components/Read";
import Draft from "./components/Draft";
import Del from "./components/Del";
export default {
  components: { Email, Read, Draft, Del, Loading },
  onLoad(options) {
    const { type } = options;
    this.type = type;

    if (options._id) {
      this._id = options._id;
      this.getEamilnfo(options._id);
    }
  },
  onShow() {
    this.getEamilnfo(this._id);
  },
  data() {
    return {
      type: "",
      mainData: {},
      _id: "",
      Loading: true,
    };
  },
  methods: {
    edit() {
      let data = {
        _id: this._id,
        theme: this.mainData.title,
        text: this.mainData.content,
        file: this.mainData.images,
        attachment: this.mainData.attachment,
      };

      uni.navigateTo({
        url:
          "/pagesOA/email/sendEmails/index?type=edit" +
          "&data=" +
          JSON.stringify(data) +
          "&user=" +
          this.mainData.addressee_uid +
          "&addressee_copy_uid=" +
          this.mainData.addressee_copy_uid,
      });
    },
    forward() {
      let data = {
        theme: this.mainData.title,
        text: this.mainData.content,
        file: this.mainData.images,
        attachment: this.mainData.attachment,
      };

      uni.navigateTo({
        url:
          "/pagesOA/email/sendEmails/index?type=forward" +
          "&data=" +
          JSON.stringify(data),
      });
    },
    reply() {
      let reqSendId = {
        username: this.mainData.sender_uid,
        nickname: this.mainData.nickname,
      };

      uni.navigateTo({
        url:
          "/pagesOA/email/sendEmails/index?type=reply" +
          "&replyUser=" +
          JSON.stringify(reqSendId),
      });
    },

    tips() {
      uni.showModal({
        title: "提示",
        content: "确定要删除邮件吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.delEamil();
          }
        },
      });
    },

    delEamil() {
      uni.showLoading({
        title: "删除中",
      });
      let paramss = {
        _id: this._id,
        emailType: this.type,
      };
      uniCloud
        .callFunction({
          name: "email",
          data: {
            name: "emailDel",
            data: paramss,
          },
        })
        .then((res) => {
          show_nativeUI_toast("删除成功", "success");
          uni.hideLoading();
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 2000);
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    getEamilnfo(_id) {
      this.Loading = true;
      let params = {
        _id: _id,
        emailType: this.type,
      };
      uniCloud
        .callFunction({
          name: "email",
          data: {
            name: "emailDetail",
            data: params,
          },
        })
        .then((res) => {
          this.mainData = res.result.data[0];
          this.Loading = false;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          this.Loading = false;
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
	recovery(){
		this.Loading = true;
		let params = {
		  _id: this._id,
		};
		uniCloud
		  .callFunction({
		    name: "email",
		    data: {
		      name: "recoveryEmail",
		      data: params,
		    },
		  })
		  .then((res) => {
          show_nativeUI_toast("恢复成功", "success");
          uni.hideLoading();
          setTimeout(() => {
            uni.navigateBack({
              delta: 2,
            });
          }, 2000);
		    uni.hideLoading();
		  })
		  .catch((err) => {
		    uni.hideLoading();
		    this.Loading = false;
		    uni.showModal({
		      content: err.message || "请求服务失败",
		      showCancel: false,
		    });
		  })
		  .finally(() => {});
	}
  },
};
</script>

<style lang="less" scoped></style>
