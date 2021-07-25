<template>
  <view class="bg">
    <view class="steps">
      <view class="list_item" v-for="(i, index) in infoList.isok" :key="index">
        <view class="steps_item">
          <view class="s_r">
            <view
              class="line"
              :style="{
                backgroundColor: index != 0 ? backgroundColor : 'rgba(0,0,0,0)',
              }"
            ></view>
            <view>
              <view
                class="index"
                v-if="i.result == 10"
                style="background-color: #2f99f6; color: #fff"
                >✓</view
              >

              <view
                class="index"
                v-if="i.result == 20"
                style="background-color: #ee0000; color: #fff"
                >✕</view
              >
              <view
                class="index"
                v-if="i.result == 30"
                :style="{ backgroundColor: '#ffb937', color: color }"
                >!</view
              >
            </view>
            <view> </view>
            <view
              class="line"
              :style="{
                backgroundColor:
                  (index != isoklength - 1 &&
                    i.result !== 20 &&
                    isoklength != 1) ||
                  (approvallengthnum != 0 && i.result !== 20)
                    ? backgroundColor
                    : 'rgba(0,0,0,0)',
              }"
            ></view>
          </view>

          <view class="s_l">
            <view class="info_item" @tap="topage(index)">
              <!-- <text>{{ i.setInfo.actionerRules[0].type=="target_management"? "部门主管":"审批人" }}</text> -->

              <view v-if="i.result == 10">
                <text>审批人</text>
                <view :style="{ WebkitLineClamp: lineNum != 0 ? lineNum : '' }"
                  >{{ i.nickname }}(已同意)
                </view>
              </view>
              <view v-if="i.result == 20">
                <text>审批人</text>
                <view :style="{ WebkitLineClamp: lineNum != 0 ? lineNum : '' }"
                  >{{ i.nickname }}(已拒绝)
                </view>
              </view>
              <view v-if="i.result == 30">
                <text>审批人</text>
                <view :style="{ WebkitLineClamp: lineNum != 0 ? lineNum : '' }"
                  >{{ i.nickname }}(待审批)
                </view>
              </view>
            </view>
            <view class="namebox">
              <view
                @click="open(index)"
                class="alldata img"
                v-if="approvallengthnum > 2"
                >全部</view
              >

              <view class="box">
                <view class="img">{{ i.nickname }}</view>
                <view class="name">{{ i.nickname }}</view>
              </view>

              <view v-for="(item, index1) in infoList.approval" :key="index1">
                <view class="box"> </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="approvallengthnum !== 0">
        <view
          class="list_item"
          v-if="isoklength == 0 || infoList.isok[isoklength - 1].result !== 20"
        >
          <view class="steps_item" v-if="approvallengthnum <= 3">
            <view class="s_r">
              <view
                class="line"
                :style="{
                  backgroundColor:
                    isoklength !== 0 ? backgroundColor : 'rgba(0,0,0,0)',
                }"
              ></view>
              <view>
                <view
                  class="index"
                  :style="{ backgroundColor: '#ffb937', color: color }"
                  >!</view
                >
              </view>
              <view> </view>
              <view
                class="line"
                style="background-color: rgba(0, 0, 0, 0)"
              ></view>
            </view>

            <view class="s_l">
              <view class="info_item">
                <view>
                  <text>审批人</text>
                  <view
                    :style="{ WebkitLineClamp: lineNum != 0 ? lineNum : '' }"
                    >{{ approvallengthnum }}人待审批
                  </view>
                </view>
              </view>
              <view class="namebox">
                <view
                  class="box"
                  v-for="(item1, index1) in infoList.approval"
                  :key="index1"
                >
                  <view class="img">{{ item1.nickname }}</view>
                  <view class="name">{{ item1.nickname }}</view>
                </view>
              </view>
            </view>
          </view>

          <view class="steps_item" v-else>
            <view class="s_r">
              <view
                class="line"
                :style="{
                  backgroundColor:
                    isoklength !== 0 ? backgroundColor : 'rgba(0,0,0,0)',
                }"
              ></view>
              <view>
                <view
                  class="index"
                  :style="{ backgroundColor: '#ffb937', color: color }"
                  >!</view
                >
              </view>
              <view> </view>
              <view
                class="line"
                style="background-color: rgba(0, 0, 0, 0)"
              ></view>
            </view>

            <view class="s_l">
              <view class="info_item">
                <view>
                  <text>审批人</text>
                  <view
                    :style="{ WebkitLineClamp: lineNum != 0 ? lineNum : '' }"
                    >{{ approvallengthnum }}人待审批
                  </view>
                </view>
              </view>
              <view class="namebox">
                <view class="box">
                  <view class="img">{{ infoList.approval[0].nickname }}</view>
                  <view class="name">{{ infoList.approval[0].nickname }}</view>
                </view>
                <view class="box">
                  <view class="img">{{ infoList.approval[1].nickname }}</view>
                  <view class="name">{{ infoList.approval[1].nickname }}</view>
                </view>

                <view>
                  <view>
                    <view class="box">
                      <view class="img" @click="open"> 全部 </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="popup_box">
        <view
          class="userbox"
          v-for="(item2, index2) in infoList.approval"
          :key="index2"
        >
          <view class="userboximg">{{ item2.nickname }}</view>
          <view class="userboxname"> {{ item2.nickname }} </view>
        </view>

        <view class="but-btn">
          <view class="popup_btn" @click="close">关闭</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: "YSteps",

  props: {
    infoList: {
      type: Object,
      default: {},
    },
    approvallengthnum: {
      type: Number,
      default: 0,
    },

    isoklength: {
      type: Number,
      default: 0,
    },

    addshow: {
      type: Boolean,
      default: true,
    },
    result: {
      type: Number,
      default: null,
    },
    color: {
      type: String,
      default: "#fff",
    },
    backgroundColor: {
      type: String,
      default: "#d6d6d6",
    },
    lineNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },

  beforeUpdate() {},

  methods: {
    open() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']

      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    seealldata() {},

    delinfo(e, index) {
      this.deldata(e, index);
    },
    topage(e) {
      this.$emit("click", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  margin: 20upx 0;
  background-color: #fff;

  display: flex;
}

.steps {
  width: 100%;
  .list_item {
    display: flex;
    flex-direction: column;
    width: 100%;
    .steps_item {
      display: flex;
      // border-bottom: 1px solid #ccc;
      width: 100%;
      .s_r {
        padding: 0 20rpx;

        display: flex;
        flex-direction: column;
        align-items: center;

        .line {
          flex: 1;
          width: 5rpx;
        }

        view {
          .index {
            width: 40rpx;
            height: 40rpx;
            font-size: 12px;
            text-align: center;
            line-height: 40rpx;
            border-radius: 50rpx;
          }
        }
      }

      .s_l {
        display: flex;

        justify-content: space-between;
        padding: 20rpx 0;

        width: 100%;
        .info_item {
          border-radius: 10upx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 30upx;

          text {
            font-size: 18px;
            font-weight: 500;
            color: #333333;
            line-height: 25px;
          }

          view {
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;

            flex-direction: column;
          }
        }
      }
    }
  }
}

.namebox {
  display: flex;
  justify-content: space-between;
}
.box {
  position: relative;
}
.img {
  width: 45px;
  line-height: 45px;
  background-color: #2f99f6;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  margin-right: 12px;
}
.name {
  text-align: center;
  margin-top: 5px;
  margin-right: 12px;
  width: 45px;
}
.add {
  margin-right: 12px;
  width: 45px;
  height: 45px;
  line-height: 41px;
  background-color: #fff;
  color: #2f99f6;
  text-align: center;
  font-size: 50px;
  font-weight: 300;
  border-radius: 5px;
  border: 1px dashed #2f99f6;
}
.del {
  width: 20px;
  z-index: 999;
  line-height: 20px;
  color: #fff;
  background-color: #ccc;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  right: 0px;
  top: -7px;
}
.alldata {
  width: 45px;
  height: 45px;
  line-height: 45px;
  background-color: #2f99f6;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  margin-right: 12px;
}
.popup_box {
  position: relative;
  height: 70vh;
  width: 100%;
  background-color: #fff;
  z-index: 999;
}
.userbox {
  padding-top: 20px;
  position: relative;
  width: 20%;
  float: left;

  height: 75px;

  display: flex;
  flex-direction: column;
  align-items: center;

  .userboximg {
    width: 50px;
    line-height: 50px;
    background-color: #2f99f6;
    border-radius: 5px;
    text-align: center;
    color: #fff;
  }

  .userboxname {
    text-align: center;
    margin-top: 5px;

    width: 50px;
  }
  .userboxdel {
    width: 20px;
    z-index: 999;
    line-height: 20px;
    color: #fff;
    background-color: #ccc;
    border-radius: 10px;
    text-align: center;
    position: absolute;
    right: 0px;
    top: 12px;
  }
}
.but-btn {
  position: absolute;
  background-color: #fff;
  width: 100%;
  bottom: 0px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup_btn {
  width: 80%;
  border-radius: 3px;
  font-size: 16px;
  line-height: 50px;
  color: #fff;
  text-align: center;

  background-color: #3b89f5;
}
</style>
