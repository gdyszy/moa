<template>
  <view style="width: 100%">
	<Loading :loading="Loading"  />
    <view class="header">
      <view class="header_img">
        <image
          src="../../static/workOverTime/ico_avator_@2x.png"
          style="width: 100%; height: 100%"
        ></image>
      </view>
      <view style="width: 80%">
        <view class="header_name">{{ listDetail.title }}</view>
        <view class="state">
          <view v-if="result == 10" style="color: #8ab689">已同意</view>
          <view v-if="result == 20" style="color: #ee0000">已拒绝</view>
          <view v-if="result == 30" style="color: #ffb937">待审批</view>
        </view>
      </view>
    </view>
    <view class="baseMsg">
      <view class="baseMsg_header">
        <view class="baseMsg_header_img">
          <image
            src="../../static/workOverTime/ico_page_@2x.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
        <view class="baseMsg_header_title"> 基础信息 </view>
      </view>
      <view class="baseMsg_item">
        <view class="baseMsg_item_title">申请人</view>
        <view class="baseMsg_content">{{ listDetail.username }}</view>
      </view>

      <view class="baseMsg_item">
        <view class="baseMsg_item_title">所在部门</view>
        <view v-if="listDetail.department" class="baseMsg_content">{{
          listDetail.department[0].name
        }}</view>
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="listDetail.department.length == 0">无</view>
        <!-- #endif -->
        <view v-if="!listDetail.department">无</view>
      </view>

      <view class="baseMsg_item">
        <view class="baseMsg_item_title">申请时间</view>
        <view class="baseMsg_content">{{ listDetail.create_date }}</view>
      </view>
    </view>
    <view style="background-color: #ffffff; padding-bottom: 20rpx">
      <view class="baseMsg_detail">
        <view class="baseMsg_header">
          <view class="baseMsg_header_img">
            <image
              src="../../static/workOverTime/ico_page_@2x.png"
              style="width: 100%; height: 100%"
            >
            </image>
          </view>
          <view class="baseMsg_header_title"> 详情信息 </view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">标题</view>
          <view class="baseMsg_content">{{ listDetail.gwtitle }}</view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">{{
            listDetail.modeid == "1" ? "拟文日期" : "收文日期"
          }}</view>
          <view class="baseMsg_content">{{ listDetail.date_time }}</view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">文件字号</view>
          <view class="baseMsg_content">{{ listDetail.fileno }}</view>
        </view>
        <view class="baseMsg_item">
          <view class="baseMsg_item_title">{{
            listDetail.modeid == "1" ? "发文单位" : "收文单位"
          }}</view>
          <view v-if="listDetail.originatordname" class="baseMsg_content">{{
            listDetail.originatordname
          }}</view>
          <!-- #ifdef MP-WEIXIN -->
          <view v-if="listDetail.originatordname.length == 0">无</view>
          <!-- #endif -->
          <view v-if="!listDetail.originatordname">无</view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">紧急程度</view>
          <view v-if="listDetail.urgency == 1" class="baseMsg_content"
            >平件</view
          >
          <view v-if="listDetail.urgency == 2" class="baseMsg_content">急</view>
          <view v-if="listDetail.urgency == 3" class="baseMsg_content"
            >紧急</view
          >
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">内容</view>
          <view class="baseMsg_content">{{ listDetail.content }}</view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">处理人</view>
          <view class="baseMsg_content">{{ listDetail.optname }}</view>
        </view>

        <view class="baseMsg_item">
          <view class="title">
            <view class="baseMsg_item_title"> 附件 </view>
          </view>

          <view class="baseMsg_content">
            <view
              class="file"
              v-for="(item, index) in listDetail.file"
              :key="index"
            >
              <view class="file_list">
                {{ item.name }}
              </view>
              <!-- #ifdef MP-WEIXIN -->
              <button
                class="file_list_btn"
                @tap="wxdownloadfiles(item.url, item.name)"
              >
                查看
              </button>
              <!-- #endif -->

              <!-- #ifdef  APP-PLUS -->
              <button
                class="file_list_btn"
                @tap="wxdownloadfiles(item.url, item.name)"
              >
                查看
              </button>
              <!-- #endif -->

              <!-- #ifdef  H5 -->
              <button
                class="file_list_btn"
                @tap="download(item.url, item.name)"
              >
                查看
              </button>
              <!-- #endif -->
            </view>
          </view>
        </view>
        <view style="margin-bottom: 30px">
          <h3>流程</h3>
          <steps
            color="#fff"
            :approvallengthnum="approvallength"
            :isoklength="isoklength"
            :infoList="list_item"
          ></steps>
        </view>
      </view>
    </view>
    <!-- <view class="showAll">已显示全部</view> -->
    <view
      :class="
        listDetail.result == 10 || listDetail.result == 20 ? 'hideBtn' : ''
      "
    >
      <view class="bottom" v-if="result == 30">
        <view class="bottom_btn" @tap="adpot(1)">
          <view class="bottom_ico">
            <image
              src="../../static/workOverTime/ico-cancel.png"
              style="width: 100%; height: 100%"
            ></image>
          </view>
          <view class="bottom_text">驳回</view>
        </view>
        <view class="bottom_btn" @tap="adpot(0)">
          <view class="bottom_ico">
            <image
              src="../../static/workOverTime/pass.png"
              style="width: 100%; height: 100%"
            ></image>
          </view>
          <view class="bottom_text">通过</view>
        </view>
      </view>
    </view>
    <uni-popup type="bottom" ref="popup">
      <view class="pop">
        <view class="pop_title">确认撤回申请吗?</view>
        <view class="pop_title" style="color: #2d89e5" @tap="revoke">撤回</view>
        <view
          class="pop_title"
          style="color: #666666; border-top: 4px solid #f4f5f7"
          @tap="close"
          >取消</view
        >
      </view>
    </uni-popup>
  </view>
</template>

<script>
import Loading from "@/pages/selectUser/components/Loading.vue";
import { timeFormat } from "@/utils/dateUtils.js";
import steps from "./components/steps/index.vue";
export default {
  components: {
    steps,
	Loading
  },
  data() {
    return {
	  Loading:true,
      listDetail: {},
      id: "",
      uid: "",
      isEdit: false,
      showbtn: false,
      hasAuth: false,
      gwflowid: "",
      list_item: {},
      result: "",
      isoklength: 0,
      approvallength: 0,
    };
  },
  onLoad: function (option) {
    this.result = option.result;
    this.getDailyInfo(option._id, option.gwflowid);
    this.id = option._id;
    this.gwflowid = option.gwflowid;
    if (uni.getStorageSync("username") == this.uid) {
      this.showbtn = true;
    } else if (option.state == "true") {
      this.read();
    } else {
    }
  },
  methods: {
	  close(){},
    //下载文件
    wxdownloadfiles(url, name) {
      let fileType = name.lastIndexOf(".");
      let ext = name.slice(fileType + 1);
      uni.showLoading({
        title: "文件下载中",
      });
      //先下载文件
      uni.downloadFile({
        url, //下载地址
        success(res) {
          uni.hideLoading();
          //预览图片或打开文件
          if (ext == "png" || ext == "jpg" || ext == "jpeg") {
            // 图片的话直接预览
            uni.previewImage({
              urls: [res.tempFilePath],
            });
            uni.hideLoading();
          } else {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (resData) => {
                uni.openDocument({
                  filePath: resData.savedFilePath,
                  showMenu: true, // 允许出现分享功能
                  success: (r) => {
                    console.log(r);
                  },
                  fail: (openError) => {
                    console.log("打开失败: ", openError);
                  },
                });
              },
              fail: (error) => {
                console.log("error: ", error);
              },
            });
          }
        },
        fail() {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: "下载出错！",
          });
        },
        complete() {
          uni.hideLoading();
        },
      });
    },

    download(url, name) {
      let a = document.createElement("a");
      a.download = name;
      a.href = url;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
    },
    edit() {
      this.isEdit = true;
    },
    getDailyInfo(id, gwflowid) {
      /* uni.showLoading({
				   title: "请稍等...",
				 }); */
      let formData = {
        _id: id,
        gwflowid: gwflowid,
        user_id: uni.getStorageSync("username"),
      };
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwGetDBDetail",
            data: formData,
          },
        })
        .then((res) => {
          uni.hideLoading();
          this.listDetail = res.result.data[0];
          this.listDetail.create_date = timeFormat(new Date(), "yyyy-MM-dd");
		  this.Loading=false;
          let info = {
            isok: [],
            approval: [],
          };

          try {
            this.listDetail.flowTaskRes.forEach((item, index) => {
              if (item.result !== 20) {
                if (item.result == 10) {
                  info.isok.push(item);
                } else {
                  info.approval.push(item);
                }
              } else {
                if (index == 0) {
                  info.isok.push(this.listDetail.flowTaskRes[0]);
                } else {
                  info.isok.push(item);
                }
                this.result = 20;
                throw new Error();
              }
            });
          } catch (e) {}
          this.list_item = info;

          this.isoklength = info.isok.length;

          let approvallength = info.approval.length;
          this.approvallength = approvallength;
        });
    },

    update() {
      let formData = {
        user_id: this.uid,
        _id: this.id,
        info: this.info,
      };
      uniCloud
        .callFunction({
          name: "daily",
          data: {
            name: "dailyUpdate",
            data: formData,
          },
        })
        .then((res) => {
          this.isEdit = false;
          uni.showToast({
            title: "修改成功！",
            icon: "none",
          });
        });
    },
    revoke() {
      let formData = {
        user_id: this.uid,
        _id: this.id,
      };
      uniCloud
        .callFunction({
          name: "daily",
          data: {
            name: "dailyDelete",
            data: formData,
          },
        })
        .then((res) => {
          uni.showToast({
            title: "撤销成功",
          });
          this.timer = setTimeout(() => {
            uni.navigateBack({
              delta: 2,
            });
          }, 1500);
        });
    },
    read() {
      let formData = {
        user_id: uni.getStorageSync("username"),
        _id: this.id,
      };
      uniCloud
        .callFunction({
          name: "daily",
          data: {
            name: "dailyRead",
            data: formData,
          },
        })
        .then((res) => {});
    },
    adpot(n) {
      uni.navigateTo({
        url: `/pages/daiban/adpot?status=${n}&id=${this.id}&gwflowid=${this.gwflowid}`,
      });
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 30rpx;
  display: flex;
  margin-bottom: 20rpx;
}

.header_avatar {
  width: 54px;
  height: 54px;
  margin-right: 15px;
  border-radius: 4px;
}

.header_name {
  font-size: 36rpx;
  font-weight: bold;
}

.header_status {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #999999;
  margin-top: 10rpx;
  font-size: 28rpx;
}

.baseMsg {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.baseMsg_header {
  display: flex;
  align-items: center;
}

.baseMsg_header_img {
  width: 24px;
  height: 24px;
  margin-right: 20rpx;
}

.baseMsg_header_title {
  font-weight: bold;
}

.baseMsg_item {
  display: flex;
  margin: 20rpx 0;
}

.baseMsg_item_title {
  color: #999999;

  width: 140rpx;
}

.baseMsg_content {
  flex: 1;
}

.baseMsg_item_val {
  padding-left: 12px;
  flex: 1;
}

.baseMsg_detail {
  border-top: 1px solid #e5e5e5;
  width: 92%;
  margin: 0 auto;
  background-color: #ffffff;
  padding-top: 30rpx;
}

.bottom {
  border-top: 1px solid #ccc;
  background-color: #ffffff;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: space-around;
  padding: 5px 0;
}

.bottom_ico {
  width: 48rpx;
  height: 48rpx;
  margin: 0 auto;
}

.bottom_btn {
  align-items: center;
}

.bottom_text {
  font-size: 24rpx;
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

.file {
  display: flex;
  width: 580rpx;
}

.file_list {
  line-height: 30px;
  margin-bottom: 5px;
  width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.file_list_btn {
  width: 150rpx;
  height: 60rpx;

  line-height: 60rpx;
}

.state {
  margin-top: 5px;
  font-size: 16px;
}
.title {
  width: 280rpx;
}
</style>
