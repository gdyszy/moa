<template>
  <view class="pages">
    <!-- 搜索功能-->
    <view class="uni-search-box">
      <uni-search-bar v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled
        :placeholder="inputPlaceholder" @clear="clear" @confirm="confirm" @cancel="cancel" @blur="confirm" />
    </view>

    <!-- 基于 uni-list 的页面布局 field="user_id.username"-->
    <uni-list class="uni-list" :border="false" :style="{height:listHight}">

      <!-- 作用于app端nvue页面的下拉加载 -->
      <!-- #ifdef APP-NVUE -->
      <refreshBox @refresh="refresh" :loading="loading"></refreshBox>
      <!-- #endif -->

      <!-- 列表渲染 -->
	  <view v-if="listdata!=''">
      <uni-list-item
        :to="'/uni_modules/yszyun-survey-app/pages/survey/detail?id='+item.survey_id+'&title='+item.survey_list.name"
        v-for="(item,index) in listdata" :key="index">
        <!-- 通过header插槽定义列表左侧图片 -->
        <!-- 通过body插槽定义布局 -->
        <template v-slot:body>
          <view class="main">
            <text class="title">{{item.survey_list.name}}</text>
            <view class="info">
              <text class="infotext">{{item.survey_list.description}}</text>
            </view>
            <view class="info"><text class="infotext">开始时间：</text>
              <uni-dateformat class="last_modify_date" :date="item.survey_list.start_time" format="yyyy-MM-dd" />
              <text class="infotext">结束时间：</text>
              <uni-dateformat class="last_modify_date" :date="item.survey_list.end_time" format="yyyy-MM-dd" />
            </view>
          </view>
        </template>
      </uni-list-item>
	  </view>
	  <view v-else>
		  <view class="tips">已显示全部</view>
	  </view>
      <!-- 加载状态：上拉加载更多，加载中，没有更多数据了，加载错误 -->
    </uni-list>

    <!-- <uni-fab ref="fab"  horizontal="right" vertical="bottom"
      @fabClick="fabClick" /> -->
  </view>
</template>

<script>
  var cdbRef, currentWebview;
  import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";
  const db = uniCloud.database();

  export default {
    components: {
      statusBar
    },
    computed: {
      inputPlaceholder(e) {
        if (uni.getStorageSync('CURRENT_LANG') == "en") {
          return 'Please enter the search content'
        } else {
          return '请输入搜索内容'
        }
      }
    },
    data() {
      return {
        horizontal: 'right',
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#007AFF',
          buttonColor: '#007AFF',
          iconColor: '#fff'
        },
        is_color_type: false,
        where: '"article_status" == 1',
        keyword: "",
        showRefresh: false,
        listHight: 0,
        current: 0,
        swiperDotIndex: 0,
        listdata: []
      }
    },
    async onReady() {
      // #ifdef APP-NVUE
      /* 可用窗口高度 - 搜索框高 - 状态栏高 */
      this.listHight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight - 50 + 'px';
      // #endif
      // #ifndef APP-NVUE
      this.listHight = 'auto'
      // #endif
      cdbRef = this.$refs.udb

    },
    async onShow() {
      this.keyword = getApp().globalData.searchText
      getApp().globalData.searchText = ''
      //这里仅演示如何，在onShow生命周期获取设备位置，并在设备或者应用没有权限时自动引导。设置完毕自动重新获取。
      //你可以基于他做自己的业务，比如：根据距离由近到远排序列表数据等

    },
    onTabItemTap() {
      this.getList()
    },
    onLoad() {
     this.getList()
    },
    methods: {
      fabClick() {
        uni.navigateTo({
          url: '/uni_modules/yszyun-survey-app/pages/survey-problem/add'
        })
      },
      getList(keyword) {
        let paramss = {
          surveyName: keyword ? keyword : ''
        }
        uniCloud.callFunction({
            name: "survey",
            data: {
              name: "getSurveyList",
              data: paramss,
            },
          }).then((res) => {
            if (res.result) {
              this.listdata = res.result.data
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
      /**
       * banner加载后触发的回调
       */
      onqueryload(data) {},
      changeSwiper(e) {
        this.current = e.detail.current
      },
      clickItem(e) {
        this.swiperDotIndex = e
      },
      clear(res) {
      },
      confirm(res) {
        // 键盘确认
        this.search(res.value);
      },
      cancel(res) {
        uni.hideKeyboard();
        this.keyword = '';
       this.search('');
      },
      search(value) {
        if (value) {
          if (this.keyword !== value) {
            this.keyword = value
          }
        }

        uni.hideKeyboard();
        this.getList(this.keyword);
      },
      retry() {
        this.refresh()
      },
      refresh() {
        cdbRef.loadData({
          clear: true
        }, () => {
          uni.stopPullDownRefresh()
          // #ifdef APP-NVUE
          this.showRefresh = false
          // #endif
          console.log('end');
        })
        console.log('refresh');
      },
      loadMore() {
        cdbRef.loadMore()
      },
      onqueryerror(e) {
        console.error(e);
      },
      onpullingdown(e) {
        console.log(e);
        this.showRefresh = true
        if (e.pullingDistance > 100) {
          this.refresh()
        }
      }
    },
    onPullDownRefresh() {
      this.refresh()
      setTimeout(function() {
        uni.stopPullDownRefresh();
      }, 3000);
    },
    onReachBottom() {
      this.loadMore()
    }
  }
</script>

<style lang="scss" scoped>
  $nav-height: 30px;

  /* #ifndef APP-NVUE */
  view {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
  }

  /* #endif */
  .pages {
    background-color: #FFFFFF;
	width: 100%;
  }

  .avatar {
    width: 200rpx;
    height: 200rpx;
    margin-right: 10rpx;
  }

  .main {
    justify-content: space-between;
  }

  .title {
    width: 480rpx;
    font-size: 32rpx;
  }

  .info {
    flex-direction: row;
    justify-content: space-between;
  }

  .infotext,
  .last_modify_date {
    font-size: 28rpx;
    color: #999999;
  }

  .uni-search-box {
    background-color: #FFFFFF;
    position: sticky;
    height: 50px;
    top: 0;
    left: 0;
    /* #ifndef APP-PLUS */
    z-index: 9;
    /* #endif */
    /* #ifdef MP-WEIXIN */
    //width: 580rpx;
    /* #endif */
  }

  .uni-nav-bar-text {
    font-size: 12px;
  }

  .input-view {
    /* #ifndef APP-PLUS-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    flex: 1;
    background-color: #f8f8f8;
    height: $nav-height;
    border-radius: 15px;
    padding: 0 15px;
    flex-wrap: nowrap;
    margin: 7px 0;
    line-height: $nav-height;
  }

  .input-uni-icon {
    line-height: $nav-height;
  }

  .nav-bar-input {
    height: $nav-height;
    line-height: $nav-height;
    /* #ifdef APP-PLUS-NVUE */
    width: 370rpx;
    /* #endif */
    padding: 0 5px;
    font-size: 14px;
    background-color: #f8f8f8;
  }

  .tips {
    color: #b2b2b2;
    width: 40%;
    margin: 20rpx auto;
    text-align: center;
  }
</style>
