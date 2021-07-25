<template>
  <view class="conte">
    <from-item
      ref="item1"
      mode="input"
      itemTitle="出差事由"
      placeholder="请输入出差事由"
      @inputVal="inputVal"
    />
    <from-item
      ref="item2"
      mode="input"
      itemTitle="起点城市"
      placeholder="请输入起点城市"
      @inputVal="startCityVal"
    />
    <from-item
      ref="item3"
      mode="input"
      itemTitle="终点城市"
      placeholder="请输入终点城市"
      @inputVal="endCityVal"
    />
    <from-item
      ref="item4"
      mode="picker"
      itemTitle="开始时间"
      @dTime="dTime"
      dateType="date"
      :pickerType="0"
    />
    <from-item
      ref="item5"
      mode="picker"
      itemTitle="结束时间"
      @dTime="dTime"
      dateType="date"
      :pickerType="1"
    />
    <from-item
      ref="item6"
      mode="input"
      itemTitle="出差天数"
      placeholder="请填写"
      @inputVal="hourVal"
    />
    <from-item
      ref="item7"
      mode="input"
      itemTitle="备注"
      placeholder="如有补充,请填写备注"
      @inputVal="remarksVal"
    />
    <!-- <view class="tip">已显示全部</view> -->
    <view class="status_bar">
      <button type="default" class="submit" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import fromItem from "@/components/fromItem/index.vue";
import { timeFormat } from "@/utils/dateUtils.js";

export default {
  components: {
    fromItem,
  },
  data() {
    return {
      formData: {
        leaveid: "",
        totals: "",
        sericnum: "",
        explain: "",
        modeid: 3,
        remarks: "",
        result: "",
        checksm: "",
        start_time: "",
        end_time: "",
        startingCity: "",
        destinationCity: "",
        user_id: uni.getStorageSync("username"),
        username: uni.getStorageSync("userInfo").nickname,
        department_id: "",
        title: uni.getStorageSync("userInfo").nickname + "的出差申请",
      },
      formData2: {
        _id: "",
        user_id: uni.getStorageSync("username"),
      },
      reSetStatus: false,
    };
  },
  created() {
    this.checkNickname((res) => {
      //判断昵称是否存在
      if (res == true) {
        let department_id = uni.getStorageSync("userInfo").department_id[0];
        if (
          department_id != undefined ||
          department_id != "" ||
          department_id != null
        ) {
          this.formData.department_id = department_id;
        }
      } else {
      }
    });
  },
  props: {
    sid: {
      type: String,
      default: "",
    },
  },
  watch: {
    sid: function (newVal, oldVal) {
      this.reSet(newVal);
    },
  },
  mounted() {
    if (this.sid != "") {
      this.reSet(this.sid);
    }
  },
  methods: {
    submit() {
      if (this.formData.explain == "") {
        uni.showToast({
          icon: "none",
          title: "请输入出差事由",
        });
        return;
      }
      if (this.formData.start_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入开始时间",
        });
        return;
      }
      if (this.formData.end_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入结束时间",
        });
        return;
      }
      if (this.formData.totals == "") {
        uni.showToast({
          icon: "none",
          title: "请输入出差天数",
        });
        return;
      }
      if (this.formData.startingCity == "") {
        uni.showToast({
          icon: "none",
          title: "请输入起点城市",
        });
        return;
      }
      if (this.formData.destinationCity == "") {
        uni.showToast({
          icon: "none",
          title: "请输入终点城市",
        });
        return;
      }
      let time1 = new Date(this.formData.start_time).getTime();
      let time2 = new Date(this.formData.end_time).getTime();
      if (time2 < time1) {
        uni.showToast({
          icon: "none",
          title: "结束时间不能早于开始时间",
        });
        return;
      }

      uni.showLoading({
        title: "请稍等...",
      });
      uniCloud
        .callFunction({
          name: "flow",
          data: {
            name: "getSN",
          },
        })
        .then((res) => {
          this.formData.sericnum =
            timeFormat(res.result, "yyyyMMdd") + res.result;
          setTimeout(() => {
            this.submitData(this.formData);
          }, 600);
        });
    },
    submitData(formData) {
      let that = this;
      that.loading = true;
      if (that.reSetStatus) {
        uniCloud.callFunction({
          name: "flow",
          data: {
            name: "flowRemove",
            data: that.formData2,
          },
        });
      }
      uniCloud
        .callFunction({
          name: "flow",
          data: {
            name: "flowAdd",
            data: formData,
          },
        })
        .then((res) => {
          that.loading = false;
          uni.hideLoading();
          that.showModal = false;
          if (res.result.id) {
            uni.showToast({
              title: "提交成功！",
            });
            that.$emit("jump", 1);
          }
        });
    },
    inputVal(e) {
      this.formData.explain = e;
    },
    startCityVal(e) {
      this.formData.startingCity = e;
    },
    endCityVal(e) {
      this.formData.destinationCity = e;
    },
    dTime(e) {
      e.type == 0
        ? (this.formData.start_time = e.val)
        : (this.formData.end_time = e.val);
    },
    hourVal(e) {
      this.formData.totals = e;
    },
    remarksVal(e) {
      this.formData.remarks = e;
    },
    reSet(id) {
      let that = this;
      that.formData2._id = id;
      uniCloud
        .callFunction({
          name: "flow",
          data: {
            name: "flowGetDetail",
            data: this.formData2,
          },
        })
        .then((res) => {
          let data = res.result.data[0];
          that.$refs.item1.itemVal = data.explain;
          that.$refs.item2.itemVal = data.startingCity;
          that.$refs.item3.itemVal = data.destinationCity;
          that.$refs.item4.ddTime = data.start_time;
          that.$refs.item5.ddTime = data.end_time;
          that.$refs.item6.itemVal = data.totals;
          that.$refs.item7.itemVal = data.remarks;
          this.formData.end_time = data.end_time;
          this.formData.start_time = data.start_time;
          that.reSetStatus = true;
        });
    },
  },
};
</script>

<style scoped>
.status_bar {
  position: fixed;
   height: 140rpx;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit {
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  color: #ffffff;
  width: 90%;
  background-color: #3b88f5;
  line-height: 90rpx;
  font-size: 12pt;
}
.tip {
  width: 50%;
  color: #b2b2b2;
  margin: 0 auto;
  margin-top: 12pt;
  text-align: center;
}
.conte {
  padding-bottom: 160rpx;
}
</style>
