<template>
  <view class="conte">
    <from-item mode="slot" itemTitle="归还车辆">
      <view slot="left">
        <view
          class="cardata"
          @click="goCarList(formData.car_id)"
          v-if="formData.car_id != ''"
        >
          <view class="cardata-box">
            <view class="carnumber"> {{ formData.carInfoRes.car_num }} </view>
       
              <view class="carinfo">
                {{ formData.carInfoRes.carbrand }} |
                {{ carColor(formData.carInfoRes.color) }}
                {{ formData.carInfoRes.seat_num }}座
           
            </view>
          </view>
          <view class="rigthicon">
            <image src="/static/workOverTime/btn_01.png" mode="" />
          </view>
        </view>
        <view class="select-car" @click="goCarList(formData.car_id)" v-else>
          <view class="leftd"></view>
          <view class="middle">选择车辆</view>
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

    <from-item
      required
      mode="inputchoose"
      itemTitle="车辆退回人"
      placeholder="请选择车辆退回人"
      :value="formData.username"
      :arrow="false"
      disabled
    />
    <from-item
      mode="picker"
      required
      itemTitle="车辆借出时间"
      :dateType="dateType"
      :pickerType="0"
      @dTime="lTime"
      :timeVal="formData.car_begin_time"
    />
    <from-item
      mode="picker"
      required
      itemTitle="车辆退回时间"
      :dateType="dateType"
      :pickerType="0"
      @dTime="rTime"
      :timeVal="formData.car_end_time"
    />
    <from-item
      required
      mode="inputchoose"
      itemTitle="车辆接收人"
      placeholder="请选择车辆接收人"
      @iconClick="chooseUser('optname')"
      @inputVal="optname"
      :value="formData.optname"
    />

    <from-item mode="slot" itemTitle="车辆状态" :arrow="false">
      <view slot="left">
        <view class="inputbox">
          <input
            type="text"
            class="slot-input"
            placeholder="车辆归还时状态描述"
            v-model="formData.explain"
          />
        </view>
      </view>
    </from-item>

    <from-item mode="slot" itemTitle="车辆图片">
      <view slot="left">
        <view class="carimg">
          <image
            v-for="(item, index) in formData.attachments"
            :key="index"
            :src="item"
            mode=""
            @click="clickImg(index)"
          />

          <view class="addimg" @tap="chooseTheImg"> + </view>
        </view>
      </view>
    </from-item>
    <btn @click="submit" />
  </view>
</template>

<script>
import fromItem from "../car/components/fromItem/index.vue";
import btn from "@/components/buttom/buttom.vue";
import { timeFormat } from "@/utils/dateUtils.js";
export default {
  components: {
    fromItem,
    btn,
  },
  data() {
    return {
      dateType: "datetime",
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
	gwGetType: {
	  type: Object,
	  default: () => {},
	},
       flowid: {
      type: String,
      default: "",
    },
  },

  methods: {
 nowTime(){
      let time = Date.now()
       return timeFormat(time, "yyyy-MM-dd hh:mm");
 },


    submit() {
      let params = {
        title: uni.getStorageSync("userInfo").nickname + "提交的车辆退回申请",
		sericnum:timeFormat(this.gwGetType.getSN, "yyyyMMdd") + this.gwGetType.getSN,
        flowcontent: this.gwGetType.flowcontent,
        flowid: this.flowid, //用车申请-获取gwGetType 返回的_id
        modeid: 4, //用车申请 3  ，车辆退回申请 4
        user_id: uni.getStorageSync("userInfo").username, // 车辆使用人id
        username: uni.getStorageSync("userInfo").nickname, // 车辆使用人名称
        car_begin_time: this.formData.car_begin_time, //  用车开始时间
        car_end_time: this.formData.car_end_time, // 用车结束时间
        car_id: this.formData.car_id, //  车辆id
        attachments: this.formData.attachments, //图片
        optid: this.formData.optid, //车辆接收人
        explain: this.formData.explain, //车辆退回状态
        optid: this.formData.optid, //接收人ID
        optname: this.formData.optname, //接收人姓名
      };
   if (!params.car_begin_time) {
     uni.showToast({
       icon: "none",
       title: "请输入车辆借出时间",
     });
     return;
   }
   if (!params.car_end_time) {
     uni.showToast({
       icon: "none",
       title: "请输入车辆退回时间",
     });
     return;
   }
   if (!params.optid) {
     uni.showToast({
       icon: "none",
       title: "请选择车辆接收人",
     });
     return;
   }

      uni.showLoading();
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwAdd",
            data: params,
          },
        })
        .then((res) => {
          if (res.result.id) {
            uni.showToast({
              title: "提交成功！",
            });

            setTimeout(() => {
              uni.navigateBack({
                delta: 2,
              });
            }, 1000);
          }

          uni.hideLoading();
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
    lTime(e) {
      this.formData.car_begin_time = e.val;
    },
    rTime(e) {
      this.formData.car_end_time = e.val;
    },
    goCarList(id) {
      uni.$once("selectCarData", (res) => {
        this.formData.car_begin_time = res.car_begin_time;
        this.formData.car_end_time = this.nowTime()

        this.formData.car_id = res.car_id;
        this.formData.carInfoRes.car_num = res.carInfo[0].car_num;
        this.formData.carInfoRes.carbrand = res.carInfo[0].carbrand;
        this.formData.carInfoRes.color = res.carInfo[0].color;

      });

      if (id) {
        uni.navigateTo({
          url: "/pagesOA/car/selectCar?id=" + id + "&status=" + 0,
        });
      } else {
        uni.navigateTo({
          url: "/pagesOA/car/selectCar?status=" + 0,
        });
      }
    },

    chooseTheImg() {
      uni.chooseImage({
        count: 9,
        success: (res) => {
          console.log(res);
          this.formData.attachments = [
            ...this.formData.attachments,
            ...res.tempFilePaths,
          ];
        },
      });
    },
    clickImg(index) {
      wx.previewImage({
        urls: this.formData.attachments,
        current: index,
      });
    },
    chooseUser(e) {
      this.$store.state.selectUser.selectUser = [];
      uni.$once("selectUser", (res) => {
        let _optname = "";
        let _optid = "";

        res.forEach((item) => {
          _optname += _optname ? `,${item.nickname}` : `${item.nickname}`;
          _optid += _optid ? `,${item.username}` : `${item.username}`;
        });

        this.formData.optname = _optname;
        this.formData.optid = _optid;
      });
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].route;
      this.$store.state.selectUser.pageRouter = curRoute;
      if (this.formData.optid) {
        let data = [];

        let a = this.formData.optid.split(",");
        let b = this.formData.optname.split(",");
        a.forEach((item, index) => {
          data.push({ username: item, nickname: b[index] });
        });

        this.$store.state.selectUser.selectUser = data;
      }

      uni.navigateTo({
        url: "/pages/selectUser/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.conte {
  width: 100vw;
}
.cardata {
  box-sizing: border-box;
  width: 675rpx;
  height: 132rpx;
  margin-top: 20rpx;
  background-color: #f0f9ff;
  padding: 24rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cardata-box {
    .carinfo {
      font-size: 14rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
  .rigthicon {
    width: 36rpx;
    height: 36rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.carimg {
  display: flex;
  flex-wrap: wrap;
  flex: 25%;
  padding-top: 14rpx;
  image {
    height: 156rpx;
    width: 156rpx;
    padding: 6rpx;
  }
  .addimg {
    height: 156rpx;
    line-height: 156rpx;
    text-align: center;
    font-size: 80rpx;
    font-weight: 300;
    color: blue;
    vertical-align: middle;
    width: 156rpx;

    padding: 6rpx;

    background-color: #f2f8ff;
  }
}

.select-car {
  margin-top: 20rpx;
  background-color: #f0f9ff;
  width: 675rpx;
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

.cardata {
  box-sizing: border-box;
  width: 675rpx;
  height: 132rpx;
  margin-top: 20rpx;
  background-color: #f0f9ff;
  padding: 24rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cardata-box {
    .carinfo {
      font-size: 14rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
  .rigthicon {
    width: 36rpx;
    height: 36rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.slot-input {
  width: 100%;
  padding: 11px 0;
  border-bottom: 1px solid #e5e5e5;
}
.inputbox {
  width: 675rpx;
}
</style>