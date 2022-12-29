<template>
  <view>
    <uni-swipe-action>
      <view v-for="(item, index) in list" :key="index">
        <uni-swipe-action-item
          :disabled="!state"
          :threshold="50"
          :right-options="del ? options1 : options2"
          @click="bindClick(item)"
          v-if="type != '3'"
        >
          <checkbox-group>
            <view
              class="max-box"
              @click="toEmailDetails(item)"
              @touchstart="showDeleteButton(item)"
              @touchend="emptyTime"
            >
              <view class="left-box" v-if="state">
                <view
                  class="done"
                  v-if="item.zt_status == '0' && state == true && type == '1'"
                >
                </view>
              </view>

              <view class="del-box" v-if="!state">
                <checkbox :value="item.id" :checked="item.checked" />
              </view>
              <view class="right-box">
                <view class="time">{{
                  getLocalTime(item.emailBody[0].send_time)
                }}</view>
                <view class="email-name">发件人: {{ item.emailBody[0].nickname }}</view>
                <view class="email-title">标题: {{ item.emailBody[0].title }}</view>
                <view class="email-content">内容: {{ item.emailBody[0].content }}</view>
              </view>
              <view class="bor"></view>
            </view>
          </checkbox-group>
        </uni-swipe-action-item>

        <uni-swipe-action-item
          :disabled="!state"
          :threshold="50"
          :right-options="del ? options1 : options2"
          @click="bindClick(item)"
          v-if="type == '3'"
        >
          <checkbox-group>
            <view
              class="max-box"
              @click="toEmailDetails(item)"
              @touchstart="showDeleteButton(item)"
              @touchend="emptyTime"
            >
              <view class="left-box" v-if="state">
                <view
                  class="done"
                  v-if="item.zt_status == '0' && state == true && type == '1'"
                >
                </view>
              </view>

              <view class="del-box" v-if="!state">
                <checkbox :value="item.id" :checked="item.checked" />
              </view>
              <view class="right-box">
                <view class="time">{{
                  getLocalTime(item.create_time, "yyyyMMdd")
                }}</view>
                <view class="email-name">{{ item.nickname }}</view>
                <view class="email-title">{{ item.title }}</view>
                <view class="email-content">{{ item.content }}</view>
              </view>
              <view class="bor"></view>
            </view>
          </checkbox-group>
        </uni-swipe-action-item>
      </view>
    </uni-swipe-action>

    <view class="del" v-if="!state">
      <view class="del-main" @click="toDel()">
        <image
          src="../../static/email/icon_del_@3x.png"
          mode="scaleToFill"
          class="del-img"
          v-show="del"
        />
        <image
          src="../../static/email/icon_remake_@3x.png"
          mode="scaleToFill"
          class="del-img"
          v-show="!del"
        />
        {{ del ? "删除" : "恢复" }}
      </view>
    </view>
  </view>
</template>

<script>
import { timeFormat } from "@/utils/dateUtils.js";
export default {
  data() {
    return {
      all: "全选",
      noall: "取消全选",
      //	全选
      allChecked: false,
      //用来决定是否长按修改
      state: true,
      //用来清空定时器
      Loop: null,
      delList: [],
      options1: [
        {
          text: "删除",
          style: {
            backgroundColor: "red",
          },
        },
      ],
      options2: [
        {
          text: "恢复",
          style: {
            backgroundColor: "blue",
          },
        },
      ],
    };
  },
  props: {
    type: {
      typeof: String,
      default: "",
    },
    del: {
      //决定是删除还是恢复
      type: Boolean,
      default: true,
    },
    title: {
      typeof: String,
      default: "收信箱",
    },
    list: {
      type: Array,
      default: () => {},
    },
  },
  methods: {
    getLocalTime(nS) {
      return timeFormat(nS, "yyyy-MM-dd hh:mm");
    },
    back() {
      uni.navigateBack({
        delta: 2,
      });
    },
    toEmailDetails(e) {
      if (this.state) {
        let value = {
          _id: e.pid || e._id,
          type: this.type,
        };
        this.$emit("toEmailDetails", value);
      }
      if (!this.state) {
        setTimeout(() => {
          e.checked = !e.checked;
          if (e.checked == true) {
            this.delList.push(e.pid);
          }
          if (e.checked == false) {
            this.delList.splice(this.delList.indexOf(e.pid), 1);
          }
        }, 1);
      }
    },

    bindClick(item) {
      uni.showModal({
        title: "提示",
        content: "确定要删除邮件吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.delEamil(item);
          }
        },
      });
    },

    delEamil(item) {
      uni.showLoading({
        title: "删除中",
      });
      let paramss = {
        _id: item.pid || item._id,
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
          uni.hideLoading();
          show_nativeUI_toast("删除成功", "success");

          setTimeout(() => {
            this.$emit("getEmailList", this.type);
          }, 1000);
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

    //长按事件
    showDeleteButton(e) {
      clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(
        function () {
          this.state = false;
        }.bind(this),
        1500
      );
    },
    emptyTime: function () {
      clearTimeout(this.Loop); //清空定时器，防止重复注册定时器
    },
    //选择所有
    checkAll() {
      if (this.allChecked == true) {
        this.allChecked = false;
        this.all = "全选";
        this.delList = [];
      } else {
        this.list.forEach((item) => {
          this.delList.push(item.id);
        });
        this.all = "取消全选";
        this.allChecked = true;
      }
    },
    //选择删除的邮件放入列表中
    ChangeCheck(e) {
      let i = e;
      let list = JSON.parse(JSON.stringify(this.delList));
      if (list.indexOf(i) == -1) {
        this.delList.push(i);
      } else {
        this.delList.splice(list.indexOf(i), 1);
      }
    },
    toDel() {
      uni.showModal({
        title: "提示",
        content: "确定要删除邮件吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.confirmMultDel();
            this.delList = [];
            this.state = true;
          }
        },
      });
    },
    confirmMultDel() {
      let _this = this;
      let type = this.type;
      let param = [];
      this.state = true;
      this.list.forEach(function (item, index) {
        let obj = {};
        if (item.checked == true) {
          obj._id = item._id;
          obj.emailType = type;
          param.push(obj);
        }
      });

      uni.showLoading();
      uniCloud
        .callFunction({
          name: "email",
          data: {
            name: "emailMultDel",
            data: param,
          },
        })
        .then((res) => {
          if (res) {
            uni.hideLoading();
            show_nativeUI_toast("删除成功", "success");
            setTimeout(() => {
              this.$emit("getEmailList", this.type);
            }, 1000);
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
  },
};
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
}
.max-box {
  width: 100vw;
  height: 174rpx;
  display: flex;

  .left-box {
    padding-top: 20rpx;
    width: 72rpx;
    .done {
      width: 16rpx;
      height: 16rpx;
      border-radius: 8rpx;
      background-color: #3b88f5;
      margin: 0 auto;
      margin-top: 18rpx;
    }
  }

  .del-box {
    width: 120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-box {
    padding-top: 20rpx;
    flex: 1;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    .time {
      position: absolute;
      top: 26rpx;
      right: 28rpx;
      font-size: 24rpx;
      color: #6e6e6e;
    }
    .email-name {
      font-size: 32rpx;
      color: #191919;
      line-height: 44rpx;
    }
    .email-title {
      font-size: 26rpx;
      color: #191919;
      margin-top: 5rpx;
      line-height: 36rpx;
      max-width: 80vw;
      min-width: 75vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .email-content {
      margin-top: 6rpx;
      max-width: 80vw;
      min-width: 75vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #6e6e6e;
      font-size: 26rpx;
      line-height: 36rpx;
    }
  }
}
.del {
  height: 108rpx;
}
.del-main {
  width: 100vw;
  height: 108rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.7);
  font-size: 24rpx;
  letter-spacing: 0rpx;
  text-align: center;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  border-top: 2rpx solid rgba(242, 242, 242, 1);
  .del-img {
    width: 56rpx;
    height: 56rpx;
  }
}
</style>
