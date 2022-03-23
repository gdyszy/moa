<template>
  <view class="conte">
    <from-item
      ref="item1"
      required
      mode="inputchoose"
      itemTitle="设备名称"
      placeholder="请填写入库设备名称"
      @iconClick="chooseUser('user')"
	  @inputVal="hourVal"
      :arrow="false" class="yido"
    />
    <from-item
      ref="item2"
      mode="inputchoose"
      itemTitle="型号"
      placeholder="请填写设备型号"
      @iconClick="chooseUser('Accompany')"
	  :arrow="false"
    />
    <from-item
      ref="item3"
      v-if="TimeDate"
      mode="picker"
      required
      itemTitle="购买日期"
      :dateType="dateType"
      @dTime="dTime"
      :pickerType="0"
    />
	<from-item
	  ref="item4"
	  required
	  mode="inputchoose"
	  itemTitle="价格 (元)"
	  placeholder="请填写购买单价"
	  @iconClick="chooseUser('Accompany')"
	  :arrow="false"
	/>
	<from-item
	  ref="item5"
	  required
	  mode="inputchoose"
	  itemTitle="保修年限 (年)"
	  placeholder="请填写保修年限"
	  @iconClick="chooseUser('Accompany')"
	  :arrow="false"
	/>
    <from-item
      ref="item6"
      v-if="TimeDate"
      mode="picker"
      required
      itemTitle="保修结束时间"
      :dateType="dateType"
      @dTime="dTime"
      :pickerType="1"
    />
    <from-item
      ref="item7"
      mode="inputchoose"
	  required
      itemTitle="设备维护商"
      placeholder="请填写设备维护商"
      @iconClick="chooseUser('placeDeparture')"
      @inputVal="hourVal"
      :arrow="false"
    />
    <from-item
      ref="item8"
      mode="inputchoose"
	  required
      itemTitle="设备维护商联系方式"
      placeholder="请填写设备维护商联系方式"
      @iconClick="chooseUser('user')"
      @inputVal="hourVal"
      :arrow="false"
    />
    <from-item
      ref="item9"
      mode="slot"
      itemTitle="设备状态"
      @inputVal="remarksVal"
    >
      <view slot="left">
        <view class="select-car" @click="goCarList">
          <view class="middle">使用中</view>
          <view class="right-btn">
            <view class="right_icon">
              <image
                src="@/static/workOverTime/btn_01.png"
                style="width: 100%; height: 100%"
              ></image>
            </view>
          </view>
        </view>
      </view>
    </from-item>

    <view class="status_bar">
      <button type="default" class="submit" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import fromItem from "./fromItem/index.vue";
import { timeFormat } from "@/utils/dateUtils.js";

export default {
  components: {
    fromItem,
  },
  data() {
    return {
      dateType: "datetime",
      line: "line",
      formData: {
        leaveid: 1,
        totals: "",
        sericnum: "",
        explain: "",
        modeid: 2,
        remarks: "",
        result: "",
        checksm: "",
        start_time: "",
        end_time: "",
        user_id: uni.getStorageSync("username"),
        username: uni.getStorageSync("userInfo").nickname,
        department_id: "",
        title: uni.getStorageSync("userInfo").nickname + "的入库申请",
      },
      formData2: {
        _id: "",
        user_id: uni.getStorageSync("username"),
      },
      reSetStatus: false,
      TimeDate: true,
    };
  },
  props: {
    sid: {
      type: String,
      default: "",
    },
  },
  created() {
    this.checkNickname((res) => {
      //判断昵称是否存在
      if (res == true) {
        let department_id = uni.getStorageSync("userInfo").department_id[0];
		// console.log(department_id)
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
  watch: {
    // sid:function(newVal,oldVal){
    // 	this.reSet(newVal)
    // }
    sid: {
      immediate: true,
      handler: function () {
        if (this.sid !== "") {
          this.reSet(this.sid);
        }
      },
    },
  },
  methods: {
    goCarList() {
      uni.navigateTo({
        url: "./components/warehouse/fixed-assets",
      });
    },
    chooseUser() {
      console.log("132");
    },
    submit() {
      if (this.formData.explain == "") {
        uni.showToast({
          icon: "none",
          title: "请填写入库设备名称",
        });
        return;
      }
      if (this.formData.start_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入购买日期",
        });
        return;
      }
      if (this.formData.end_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入保修结束时间",
        });
        return;
      }
      if (this.formData.totals == "") {
        uni.showToast({
          icon: "none",
          title: "请输入结束时间",
        });
        return;
      }
      let time1 = new Date(this.formData.start_time).getTime();
      let time2 = new Date(this.formData.end_time).getTime();
      if (this.dateType === "halfDay") {
        let t1 = this.formData.start_time.split(" ")[0];
        let a1 = this.formData.start_time.split(" ")[1];
        time1 = new Date(t1).getTime();
        let t2 = this.formData.end_time.split(" ")[0];
        let a2 = this.formData.end_time.split(" ")[1];
        time2 = new Date(t2).getTime();
        if (time1 === time2) {
          if (a1 === "上午" && a2 === "下午") {
            time1 === time2;
          } else if (a1 === "下午" && a2 === "上午") {
            time1 = time1 + 1;
          }
        }
      }
      if (time2 === time1 && this.dateType === "datetime") {
        uni.showToast({
          icon: "none",
          title: "结束时间不能等于开始时间",
        });
        return;
      }
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
            // that.$emit('jump', {
            //     componentType: 'checkDeatil'
            // })
            that.$emit("jump", 1);
          }
        });
    },

    dTime(e) {
      if (this.arrindex == 4) {
        this.formData.start_time = e.val[0];
        this.formData.end_time = e.val[1];
      } else {
        e.type == 0
          ? (this.formData.start_time = e.val)
          : (this.formData.end_time = e.val);
      }
    },
    textVal(e) {
      this.formData.explain = e;
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
          if (data.leaveid === 1) {
            that.itemTitle = "时长(小时)";
            that.dateType = "datetime";
          } else if (data.leaveid === 5) {
            that.itemTitle = "时长(天)";
            that.dateType = "date";
          } else {
            that.itemTitle = "时长(天)";
            that.dateType = "halfDay";
          }
          that.$refs.item1.selCur = data.leaveid - 1;
          that.$refs.item2.ddTime = data.start_time;
          that.$refs.item3.ddTime = data.end_time;
          that.$refs.item4.itemVal = data.totals;
          that.$refs.item5.itemVal = data.explain;
          that.$refs.item6.itemVal = data.remarks;
          this.formData.end_time = data.end_time;
          this.formData.start_time = data.start_time;
          that.reSetStatus = true;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.status_bar {
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

.select-car {
  margin-top: 20rpx;
  /* background-color: #f0f9ff; */
  border-bottom: 2rpx solid #CCCCCC;
  // width: 675rpx;
  width: calc(100vw - 75rpx);
  height: 92rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-car > .leftd {
  height: 12rpx;
  width: 12rpx;
  margin: 38rpx 32rpx 41rpx 32rpx;
  border-radius: 6rpx;
  background-color: #2b81fa;
}
.select-car > .middle {
  flex: 1;
  line-height: 92rpx;
}
.select-car > .right-btn {
  width: 60rpx;
  height: 36rpx;

  display: flex;
  align-content: center;
  align-items: center;
}

.right_icon {
  width: 36rpx;
  font-weight: bold;
  height: 36rpx;
  font-size: 30rpx;
}
</style>
