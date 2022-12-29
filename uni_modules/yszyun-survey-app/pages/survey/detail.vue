<template>
	<view>
  <view class="article">
    <!-- #ifdef APP-PLUS -->
    <uni-nav-bar :statusBar="true" :border="false"></uni-nav-bar>
    <!-- #endif -->
    <h4 class="article-title">{{ description }}</h4>
    <view class="items" v-for="(item,index) in listdata" :key="index">
      <!-- 标题 -->
      <view class="title">
        {{index+1}}. {{item.title}} {{item.option_type==0?"(单选题)":item.option_type==1?"(多选题)":"(文本题)"}}
      </view>
      <uni-easyinput v-if="item.option_type==2" type="textarea" trim="all" :disabled="reply_status!==0"
        v-model="item.checkbox" placeholder=" " />
      <uni-data-checkbox v-else :multiple="item.option_type==1?true:false" :disabled="reply_status!==0"
        v-model="item.checkbox" :map="map" :localdata="item.toption" @change="change(item)"></uni-data-checkbox>
    </view>
	</view>
    <view class="status_bar">
      <button type="default" class="submit" :disabled="reply_status!==0" @click="btn">
        {{reply_status==3?"已结束":reply_status==2?"未开始":reply_status==1?"已提交":"提交"}}
      </button>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database();
  import {
    mapGetters
  } from 'vuex';
  export default {
    // #ifdef APP
    onBackPress({
      from
    }) {
    },
    // #endif
    data() {
      return {
        map: {
          text: 'content',
          value: 'index'
        },
        // 当前显示 _id
        id: "",
        title: 'title',
        description: '',
        listdata: [],
        formData: {
          noData: '<p style="text-align:center;color:#666">详情加载中...</p>'
        },
        reply_status: null
      }
    },
    computed: {
      ...mapGetters({
        'userInfo': 'user/info',
        'hasLogin': 'user/hasLogin'
      }),
    },
    onLoad(event) {
      if (event.id) {
        this.id = event.id
        this.getDetail(event.id)
      }
      //若上一页传递了标题过来，则设置导航栏标题
      if (event.title) {
        this.title = event.title
        uni.setNavigationBarTitle({
          title: event.title
        })
      }

    },
    methods: {
      btn() {
        uni.showLoading({
          title: "加载中..."
        })
        for (let i = 0; i < this.listdata.length; i++) {
          if (this.listdata[i].checkbox === null || this.listdata[i].checkbox === '') {
            uni.showToast({
              title: '请答完题目再提交',
              icon: 'none'
            });
            return false
          }
        }
        let paramss = {
          survey_id: this.id,
          replyData: this.listdata
        }
        uniCloud.callFunction({
            name: "survey",
            data: {
              name: "surveyReply",
              data: paramss,
            },
          }).then((res) => {
            uni.showToast({
              title: '提交成功',
            });
            setTimeout(() => uni.navigateBack(), 500)
          })
          .catch((err) => {
            uni.showModal({
              content: err.message || "请求服务失败",
              showCancel: false,
            });
          })
          .finally(() => {
            uni.hideLoading();
          });
      },
      change(item) {
        if (item.checkbox.length == 0) {
          item.checkbox = null
        }
      },
      getDetail(id) {
        uni.showLoading({
          title: "加载中..."
        })
        let _this = this
        let paramss = {
          survey_id: id
        }
        uniCloud.callFunction({
            name: "survey",
            data: {
              name: "getSurveyDetail",
              data: paramss,
            },
          }).then((res) => {
            if (res) {
              _this.description = res.result.survey_list.description
              this.reply_status = res.result.reply_status
              if (res.result.reply_status === 0) {
                res.result.data.forEach(item => {
                  if(item.option_type == 1){
                    item["checkbox"] = []
                  }else{
                  item["checkbox"] = null
                  }
                })
              }
              _this.listdata = res.result.data
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
      $log(...args) {
      }
    }
  }
</script>

<style scoped>
  .header-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }

  /* 标题 */
  .uni-title {
    display: flex;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #3b4144;
  }

  /* 描述 额外文本 */
  .uni-note {
    color: #999;
    font-size: 12px;

    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    align-items: center;
  }

  .footer {
    display: flex;
    align-items: center;
  }

  .footer-button {
    display: flex;
    align-items: center;
    font-size: 12px;
    height: 30px;
    color: #fff;
    background-color: #ff5a5f;
  }

  .banner {
    position: relative;
    margin: 0 15px;
    height: 180px;
    overflow: hidden;
  }

  .banner-img {
    position: absolute;
    width: 100%;
  }

  .banner-title {
    display: flex;
    align-items: center;
    position: absolute;
    padding: 0 15px;
    width: 100%;
    bottom: 0;
    height: 30px;
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    box-sizing: border-box;
  }

  .uni-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .article {
    padding: 0 20px 70px 20px;
  }

  .article-title {
    padding: 20px 0;
    margin-bottom: 0px;
  }

  .article-content {
    padding: 15px;
    font-size: 15px;
    overflow: hidden;
  }

  .items {
    margin: 10px 0;
  }

  .title {
    margin-bottom: 5px;
  }

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
	justify-content: center;
	align-items: center;
  }
 /deep/ .uni-easyinput{
    width: 90%;
  }
</style>
