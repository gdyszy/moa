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
									标题:&nbsp;{{item.gwtitle}}
						</view>
						<view class="record_item_state">
								<view v-if="item.result==10" style="color:#8ab689">已同意</view>
								<view v-if="item.result==20" style="color:#ee0000">已拒绝</view>
								<view v-if="item.result==30" style="color:#ffb937">待审批</view>
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
      formData: {
        user_id: uni.getStorageSync("username"),
      },
    };
  },
  mounted() {
    this.getList();
  },onShow() {
  	this.getList();
  },
  methods: {
	  onPullDownRefresh(){
	  	this.getList();
	  	setTimeout(function() {
	  		uni.stopPullDownRefresh();
	  	}, 1000);
	  },
    getList() {
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwGetDB",
            data: this.formData,
          },
        })
        .then((res) => {
          this.recordList = res.result;
          
        });
    },
    routeTo(id, gwflowid,result ) {
      uni.navigateTo({
        url: "/pages/daiban/detail?_id=" + id + "&gwflowid=" + gwflowid+"&result="+result,
      });
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
  line-height: 30px;
  padding-left: 10px;
}
.record_item_state {
  padding-left: 10px;
}
.showAll {
		color: #B2B2B2;
		margin: 20px auto 10px;
		width: 50%;
		text-align: center;
		
	}
</style>
