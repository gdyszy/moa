<template>
  <view class="conte">
    <from-item
      required
      mode="input"
      itemTitle="车辆使用人"
      placeholder="请选择车辆使用人"
      :value="formData.username"
      disabled
      :arrow="false"
    />
    <from-item
      mode="inputchoose"
      itemTitle="随同人员"
      placeholder="请选择随同人员"
      @iconClick="chooseUser('optname')"
      @inputVal="optname"
      :value="formData.optname"
      disabled
    />
    <from-item mode="slot" itemTitle="外部随同人员" :arrow="false">
      <view slot="left">
        <view class="inputbox">
          <input
            type="text"
            class="slot-input"
            placeholder="点击填写外部随同人员"
            v-model="formData.external_persion"
          />
        </view>
      </view>
    </from-item>
    <from-item
      ref="item2"
      mode="picker"
      required
      itemTitle="用车开始时间"
      :dateType="dateType"
      :timeVal="formData.car_begin_time"
      @dTime="sTime"
      :pickerType="0"
    />
    <from-item
      ref="item3"
      mode="picker"
      required
      itemTitle="用车结束时间"
      :dateType="dateType"
      @dTime="eTime"
      :timeVal="formData.car_end_time"
      :pickerType="1"
    />
    <from-item required mode="slot" itemTitle="出发地" :arrow="false">
      <view slot="left">
        <view class="inputbox">
          <input
            type="text"
            class="slot-input"
            placeholder="请输入出发地"
            v-model="formData.place_bengin"
          />
        </view>
      </view>
    </from-item>
    <from-item required mode="slot" itemTitle="目的地" :arrow="false">
      <view slot="left">
        <view class="inputbox">
          <input
            type="text"
            class="slot-input"
            placeholder="请输入目的地"
            v-model="formData.place_end"
          />
        </view>
      </view>
    </from-item>
    <from-item required mode="slot" itemTitle="用车事由" :arrow="false">
      <view slot="left">
        <view class="inputbox">
          <input
            type="text"
            class="slot-input"
            placeholder="请输入用车事由"
            v-model="formData.explain"
          />
        </view>
      </view>
    </from-item>

    <from-item
      ref="item5"
      mode="slot"
      required
      itemTitle="车辆选择"
      @inputVal="remarksVal"
    >
      <view slot="left">
        <view
          class="cardata"
          @click="goCarList(formData.car_id)"
          v-if="formData.car_id != ''"
        >
          <view class="cardata-box">
            <view class="carnumber"> {{ formData.car_num }} </view>
            <view class="carinfo">
              {{ formData.carbrand }}
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
      user: uni.getStorageSync("userInfo"),
    };
  },
  props: {
    sid: {
      type: String,
      default: "",
    },
    gwGetType: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
    flowid: {
      type: String,
      default: "",
    },
  },

  watch: {
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
	  optname(e){},
	  remarksVal(e){},
    goCarList(id) {
      uni.$once("selectCarData", (res) => {
        this.formData.car_num = res.car_num;
        this.formData.carbrand = res.carbrand;
        this.formData.car_id = res._id;
      });

      if (id) {
        uni.navigateTo({
          url: "/pagesOA/car/selectCar?id=" + id,
        });
      } else {
        uni.navigateTo({
          url: "/pagesOA/car/selectCar",
        });
      }
    },
    chooseUser(e) {
      this.$store.state.selectUser.selectUser = [];
      uni.$once("selectUser", (res) => {
       // console.log(this.$store.state.selectUser.selectUser);
        if (e == "optname") {
          let _optname = "";
          let _optid = "";

          res.forEach((item) => {
            _optname += _optname ? `,${item.nickname}` : `${item.nickname}`;
            _optid += _optid ? `,${item.username}` : `${item.username}`;
          });

          this.formData.optname = _optname;
          this.formData.optid = _optid;
        }
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
    submit() {
      if (this.formData.car_begin_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入用车开始时间",
        });
        return;
      }else{
		  let starttime=new Date(this.formData.car_begin_time).getTime()
		  let totime=new Date().getTime()
		  if(starttime < totime){
			  uni.showToast({
			    icon: "none",
			    title: "不能选择之前时间",
			  });
			  return;
		  }
	  }
      if (this.formData.car_end_time == "") {
        uni.showToast({
          icon: "none",
          title: "请输入用车结束时间",
		  duration:2000,
        });
        return;
      }else{
		  if(!this.formData.car_begin_time == ''){
			  let starttime=new Date(this.formData.car_begin_time).getTime()
			  let endtime=new Date(this.formData.car_end_time).getTime()
			  if(endtime <= starttime){
				  uni.showToast({
				    icon: "none",
				    title: "不能小于开始时间",
					duration:2000
				  });
				  return;
			  }
		  }
	  }
      if (this.formData.place_bengin == "") {
        uni.showToast({
          icon: "none",
          title: "请输入出发地",
		  duration:2000,
        });
        return;
      }
      if (this.formData.place_end == "") {
        uni.showToast({
          icon: "none",
          title: "请输入目的地",
		  duration:2000,
        });
        return;
      }
      if (this.formData.explain == "") {
        uni.showToast({
          icon: "none",
          title: "请输入用车事由",
		  duration:2000,
        });
        return;
      }
      if (this.formData.car_id == "") {
        uni.showToast({
          icon: "none",
		  duration:2000,
          title: "请选择车辆",
        });
        return;
      }
		let  nickname = uni.getStorageSync('userInfo').nickname?uni.getStorageSync('userInfo').nickname:uni.getStorageSync('userInfo').username?uni.getStorageSync('userInfo').username:uni.getStorageSync('userInfo').mobile?uni.getStorageSync('userInfo').mobile:''
     if(this.gwGetType==null){
     uni.showToast({
       icon: "none",
       duration:2000,
       title: "流程配置异常，请联系管理员。",
     });
     return;	
     }
	  let params = {
        title: nickname + "提交的用车申请",
        sericnum:
          timeFormat(this.gwGetType.getSN, "yyyyMMdd") + this.gwGetType.getSN,
        flowcontent: this.gwGetType.flowcontent,
        flowid: this.flowid, //用车申请-获取gwGetType 返回的_id
        modeid: 3, //用车申请 3  ，车辆退回申请 4
        optid: this.formData.optid, //随同人员id
        optname: this.formData.optname, // 随同人员名字
        user_id: uni.getStorageSync("userInfo").username, // 车辆使用人id
        username: nickname, // 车辆使用人名称
        car_begin_time: this.formData.car_begin_time, //  用车开始时间
        car_end_time: this.formData.car_end_time, // 用车结束时间
        car_id: this.formData.car_id, //  车辆id
        external_persion: this.formData.external_persion, // 外部随同人员
        place_bengin: this.formData.place_bengin, //  出发地
        place_end: this.formData.place_end, // 目的地
        explain: this.formData.explain, // 用车事由
      };
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

    sTime(e) {
		console.log(e)
      this.formData.car_begin_time = e.val;
    },
    eTime(e) {
      this.formData.car_end_time = e.val;
    },
    persion(e) {
      this.formData.external_persion = e;
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
