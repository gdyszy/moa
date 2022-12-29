<template>
  <view class="item">
    <view class="input_item" v-if="mode == 'input'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="input_put">
        <input
          type="text"
          style="width: 100%"
          :disabled="disabled"
          maxlength="40"
          v-model="value"
          :placeholder="placeholder"
          placeholder-style="#999999"
        />
      </view>
    </view>

    <view class="input_item" v-if="mode == 'slot'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="slot">
        <slot name="left"></slot>
      </view>
    </view>

    <view class="input_item" v-if="mode == 'picker'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="input_put picker_put">
        <uni-datetime-picker
          class="pickerDate"
          :value="timeVal"
          :border="false"
          :type="dateType"
          :hide-second="true"
          @change="change"
          style="width: 100%"
        ></uni-datetime-picker>
        <view class="tab_icon" style="margin-top: 25rpx">
          <image
            src="@/static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>
    <view v-if="mode == 'select'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="input_put" @tap="selectType">
        {{ arr[selCur].name }}
        <view style="z-index: 99999">
          <uni-popup ref="selectPopup" type="bottom" :maskClick="false">
            <view class="sel_content">
              <view class="header">
                <view style="font-weight: bold; font-size: 16px">请假类型</view>
                <view style="color: #3b88f5" @tap="selConfirm">确定</view>
              </view>
              <scroll-view style="height: 80%" scroll-y="true">
                <view
                  class="list-cell"
                  v-for="(item, index) in arr"
                  :key="index"
                  @tap="selType(index)"
                >
                  <view class="list_icon" v-if="selCur == index">
                    <image
                      src="@/static/workOverTime/btn-next@2x.png"
                      style="width: 100%; height: 100%"
                    ></image>
                  </view>
                  <view class="list_icon" v-else>
                    <image
                      src="@/static/workOverTime/btn-next@2x-1.png"
                      style="width: 100%; height: 100%"
                    ></image>
                  </view>
                  <view style="font-size: 16px"
                    >{{ item.name
                    }}<text class="list_text">{{ item.msg }}</text></view
                  >
                </view>
              </scroll-view>
            </view>
          </uni-popup>
        </view>
        <view class="tab_icon">
          <image
            src="@/static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>

    <view v-if="mode == 'inputchoose'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="input_put" @tap.stop="iconClick">
        <input
          type="text"
          style="width: 100%"
          v-model="value"
          :disabled="disabled"
          maxlength="40"
          :placeholder="placeholder"
          placeholder-style="#999999"
        />
        <view class="tab_icon" v-if="arrow">
          <image
            src="@/static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>

    <view v-if="mode == 'textarea'">
      <view class="req" v-if="required">*</view>
      <view class="title">{{ itemTitle }}</view>
      <view class="input_put">
        <textarea
          style="height: 160rpx; width: 100%"
          v-model="itemVal"
          :placeholder="placeholder"
        />
      </view>
    </view>

    <uni-popup type="center" ref="popup">
      <view class="warnTip">
        <view>这段时间休息不需要请假!</view>
        <view>如果排班有问题请联系管理员</view>
        <view class="tipBtn" @tap="closePop">我知道了</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      itemVal: "",
      dTime: "",
      selectCur: "",
      selCur: 0,
    };
  },
  components: {},
  watch: {
    itemVal: function (newVal, oldVal) {
		console.log("this.itemVal:"+this.itemVal)
      this.$emit("inputVal", this.itemVal);
    },
    dTime: function (newVal, oldVal) {
      this.$emit("dTime", {
        val: this.dTime,
        type: this.pickerType,
      });
    },
  },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    itemTitle: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    timeVal: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "",
    },
    pickerType: {
      type: Number,
      default: 0,
    },
    arr: {
      type: Array,
      default: function () {
        return [];
      },
    },
    dateType: {
      type: String,
      default: "datetime",
    },
  },
  methods: {
    closePop() {
      this.$refs.popup.close();
    },
    selectType() {
      this.$refs.selectPopup.open();
    },
    selType(index) {
      this.selCur = index;
    },
    selConfirm() {
      this.$refs.selectPopup.close();
      this.$emit("selectVal", this.selCur);
    },
    change(e) {
      this.dTime = e;
    },
    iconClick() {
      this.$emit("iconClick");
    },
  },
};
</script>

<style scoped>
.item {
  padding: 0 14pt;
  background-color: #ffffff;
  padding-bottom: 30rpx;
  /* width: 100%; */
}

.input_put {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e5e5e5;
  display: flex;
  justify-content: space-between;
}
.slot {
  display: flex;
  justify-content: space-between;
}

.pickerDate {
  color: #999999;
}

.picker_put {
  display: flex;
  justify-content: space-between;
}

.tab_icon {
  width: 36rpx;
  height: 36rpx;
}

.warnTip {
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 15rpx;
}

.tipBtn {
  color: #007aff;
  width: 100%;
  text-align: right;
  margin-top: 20rpx;
}

.sel_content {
  width: 100%;
  background-color: #ffffff;
  height: 600rpx;
  z-index: 9999;
}

.header {
  padding: 30rpx;
  display: flex;
  align-content: center;
  justify-content: space-between;
  border-bottom: 8px solid #f4f5f7;
}

.list-cell {
  display: flex;
  border-bottom: 1px solid #cccccc;
  padding: 20rpx 0;
  width: 90%;
  margin: 0 auto;
}

.list_icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 30rpx;
}

.list_text {
  font-size: 14px;
  color: #999999;
  margin-left: 20rpx;
}
.title {
  position: relative;
}
.req {
  position: absolute;
  left: 22rpx;
  color: #e44343;
}
</style>
