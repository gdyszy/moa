<template>
  <view>
    <view class="adpot">
      <view>处理结果</view>
      <view class="adpot_content">
        <view class="adpot_item" @tap="selAdpot(0)">
          <image
            class="adpot_ico"
            v-show="status == 0"
            src="../../static/workOverTime/btn-next@2x.png"
          ></image>
          <image
            class="adpot_ico"
            v-show="status == 1"
            src="../../static/workOverTime/btn-next@2x-1.png"
          ></image>
          <text>通过</text>
        </view>
        <view class="adpot_item" style="margin-left: 80rpx" @tap="selAdpot(1)">
          <image
            class="adpot_ico"
            v-show="status == 1"
            src="../../static/workOverTime/btn-next@2x.png"
          ></image>
          <image
            class="adpot_ico"
            v-show="status == 0"
            src="../../static/workOverTime/btn-next@2x-1.png"
          ></image>
          <text>驳回</text>
        </view>
      </view>
      <view>审批意见</view>
      <view class="inputView" style="padding: 20rpx 0">
        <textarea
          v-model="formData.checksm"
          maxlength="70"
          placeholder-style="color:#B3B3B3"
          placeholder="请输入审批意见"
        />
      </view>
    </view>
    <!-- <view class="bottom">
			<button type="default" @tap="cancel">取消</button>
			<button type="default" style="background-color: #3B89F5; color: #FFFFFF;" @tap="agree">确定</button>
		</view> -->
    <view class="status_bar">
      <button class="btn1" @click="cancel">取消</button>
      <button class="btn2" @click="agree">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      status: 0,
      formData: {
        _id: "",
        user_id: uni.getStorageSync("username"),
        result: 30,
        checksm: "",
        gwflowid: "",
      },
    };
  },
  onLoad(options) {
    this.status = options.status;
    this.formData._id = options.id;
    this.formData.gwflowid = options.gwflowid;
    this.formData.optname = uni.getStorageSync("userInfo").nickname;
  },
  methods: {
    selAdpot(n) {
      this.status = n;
    },
    cancel() {
      uni.navigateBack({
        delta: 1,
      });
    },
    agree() {
      if (this.status == 0) {
        this.formData.result = 10;
      } else if (this.status == 1) {
        this.formData.result = 20;
        if (this.formData.checksm == "") {
          show_nativeUI_toast("请填写审批意见！", "error");
          return false;
        }
      }
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwDBUpdata",
            data: this.formData,
          },
        })
        .then((res) => {
          show_nativeUI_toast("审核成功");

          setTimeout(() => {
            uni.navigateBack({
              delta: 2,
            });
          }, 1000);
        });
    },
  },
};
</script>

<style>
page {
  background-color: #f8f8f8;
  display: block;
}
</style>
<style scoped>
.adpot {
  background-color: #ffffff;
  margin-top: 20rpx;
  padding: 20rpx;
}
.adpot_ico {
  width: 38rpx;
  height: 38rpx;
  margin-right: 15rpx;
}
.adpot_item {
  display: flex;
  align-items: center;
}
.adpot_content {
  display: flex;
  padding: 30rpx 0;
}
.inputView {
  padding: 30rpx 0;
  border-bottom: 1px solid #cccccc;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20rpx;
}
.inputView textarea {
  line-height: 40rpx;
  height: 120rpx;
  width: 100%;
}
.status_bar {
  border-top: 1px solid #ccc;
  position: fixed;
  height: 140rpx;
  z-index: 1;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btns {
  display: flex;
  justify-content: center;
  color: #ffffff;
  width: 100%;
}

.btn1,
.btn2 {
  width: 300rpx;
  height: 100rpx;
  font-size: 30rpx;
  line-height: 100rpx;
}

.btn1 {
  color: #666;
  background-color: #fff;
  border: 1px solid #e3e4e5;
}

.btn2 {
  color: #fff;
  background-color: #3b89f5;
  margin-left: 13px;
}
</style>
