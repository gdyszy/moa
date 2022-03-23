<template>
	<view class="bg">
		<view v-for="(item,index) in recordList" :key="index" @click="routeTo(item._id,item.gwflowid,item.result)">
			<view :class="item!=0 ?'record_item':'record_item--normargin'">
				<image src="@/static/ico_page.png" class="img">
					<view class="record_item_right">
						<view class="record_item_right_title">
							<span>{{item.title}}</span>
						</view>
						<view class="record_item_title">
									用车时间:&nbsp;{{item.car_begin_time}}
						</view>
            	<view class="record_item_title">
									结束时间:&nbsp;{{item.car_end_time}}
						</view>
            	<view class="record_item_title">
									审批状态:&nbsp;{{item.gwtitle}}
                	<span  v-if="item.result==10" style="color:#8ab689">已同意</span>
								<span v-if="item.result==20" style="color:#ee0000">已拒绝</span>
								<span v-if="item.result==30" style="color:#ffb937">待审批</span>
						</view>
	
					</view>
			</view>
			
		</view>
		<view class="showAll">已显示全部</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      recordList: [],
      gwflowid: "",
      formData: {
        user_id: uni.getStorageSync("username"),
        modeid: 3,
      },
    };
  },
  onShow() {
    this.getList();
  },
  onLoad() {
    this.getType();
  },
  methods: {
    getType() {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwGetType",
            data: {
              modeid: 3, //用车申请 3  ，车辆退回申请 4
            },
          },
        })
        .then((res) => {
          this.gwflowid = res.result.data[0]._id;
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

    onPullDownRefresh() {
      this.getList();
      setTimeout(function () {
        uni.stopPullDownRefresh();
      }, 1000);
    },
    getList() {
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwList",
            data: this.formData,
          },
        })
        .then((res) => {
          this.recordList = res.result.data;
        });
    },
    routeTo(id, gwflowid, result) {
      uni.navigateTo({
        url: "/pagesOA/car/detail?_id=" + id + "&gwflowid=" + this.gwflowid,
      });
      // uni.navigateTo({
      //   url:
      //     "/pagesOA/car/detail?_id=" +
      //     id +
      //     "&gwflowid=" +
      //     this.gwflowid +
      //     "&result=" +
      //     result,
      // });
    },
  },
};
</script>

<style>
* {
  -webkit-text-size-adjust: none;
}

.bg {
  background-color: #f4f5f7;
  width: 100%;
}

.record_item {
  margin-top: 5px;
  padding: 12px 14px;
  display: flex;
  background-color: #fff;
}

.record_item--normargin {
  padding: 12px 14px;
  display: flex;
}

.record_item_right_title {
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.img {
  width: 24px;
  height: 24px;
}
.record_item_title {
  line-height: 38rpx;
  font-size: 24rpx;
  padding-left: 10px;
  margin-top: 4rpx;
  color: #666666;
}
.record_item_state {
  padding-left: 10px;
}
.showAll {
  color: #b2b2b2;
  margin: 20px auto 10px;
  width: 50%;
  text-align: center;
}
</style>
