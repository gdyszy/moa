<template>
  <view style="padding-bottom:300rpx">
    <view class="equipment" :model="app">
      <!-- 设备 -->
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <uni-forms-item label="设备名称" required class="equipment-item"></uni-forms-item>
        <view class="printer">
          <picker @change="bindChange" :value="category_index" :range="category">
            <view class="uni-input input">{{ category[category_index]?category[category_index]:'暂无数据，请在管理后台添加。' }}</view>
          </picker>
        </view>
      </uni-forms>
      <!-- 型号 -->
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <uni-forms-item label="型号" required class="equipment-item"></uni-forms-item>
        <textarea type="textarea" placeholder="请输入设备型号" v-model.trim="app.device_model" @chenge="chenge"></textarea>
      </uni-forms>
      <!-- 日期 -->
      <uni-forms :modelValue="baseFormData" class="relation-item tall">
        <uni-forms-item label="购买日期" required class="equipment-item"></uni-forms-item>
        <uni-datetime-picker
          placeholder="请选择购买日期"
          v-model="app.buy_date"
          class="picker"
          type="date"
          :image="true"
        ></uni-datetime-picker>
      </uni-forms>
      <!-- 价格（元） -->
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <uni-forms-item label="价格 (元)" required class="equipment-item"></uni-forms-item>
        <textarea type="textarea" placeholder="请填写购买单价" v-model.trim="app.price" @chenge="chenge"></textarea>
      </uni-forms>
      <!-- 保修 -->
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <view class="guarantee">保修年限 (年)</view>
        <textarea type="textarea" placeholder="请填写保修年限" v-model.trim="app.repair_year" @chenge="chenge"></textarea>
      </uni-forms>
      <!-- 保修结束时间 -->
      <uni-forms :modelValue="baseFormData" class="relation-item tall">
        <view class="guarantee repairs">保修结束时间</view>
        <uni-datetime-picker
          placeholder="请选择保修结束时间"
          class="picker"
          type="date"
          :image="true"
          v-model="app.repair_end_date"
        ></uni-datetime-picker>
      </uni-forms>
      <!-- 设备维护商 -->
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <view class="Maintenance">设备维护商</view>
        <textarea type="textarea" placeholder="请填写设备维护商" v-model.trim="app.maintainer" @chenge="chenge"></textarea>
      </uni-forms>
      <uni-forms :modelValue="baseFormData" class="relation-item">
        <view class="Maintenance">设备维护商联系方式</view>
        <textarea type="textarea" placeholder="请填写设备维护商联系方式" v-model.trim="app.maintainer_tel" @chenge="chenge"></textarea>
      </uni-forms>
      <!-- 设备使用状态 -->
      <view class="relation-item-last">
        <view class="state">设备状态</view>
        <picker @change="bindPickerChange" :value="app.status" :range="array">
          <view class="uni-input input">{{ array[app.status] }}</view>
        </picker>
      </view>
	  <view class="relation-item-mp"></view>
	  <view class="status_bar">
	    <button type="default" class="submit" @click="submit">提交</button>
	  </view>
    </view>
	
  </view>
</template>

<script>
export default {
  data() {
    return {
      category_index: 0,
      category: [],
      oldCategory: '',
      index: 0,
      array: ['闲置', '使用中', '维修中', '报废'],
      app: {
        property_device_category_id: '',
        device_model: '',
        buy_date: '',
        price: '',
        repair_year: '',
        repair_end_date: '',
        maintainer: '',
        status: 0,
        maintainer_tel: '',
      },
      iconClassList: {
        name: 'arrowright',
        unicode: 'e583',
      },
      // 表单数据
      baseFormData: {
        name: '',
        repair_year: '',
        introduction: '',
        sex: 2,
        hobby: [5],
      },
    };
  },
  props: {
    stat: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    stat: {
      immediate: true,
      handler: function () {
        if (this.stat !== 0) {
         this.GetCategory();
        }
      },
    },
  },
  onShow() {
    this.GetCategory();
  },
  
  methods: {
    //获取分类列表
    GetCategory() {
		let _this = this
      const params = {};
      uniCloud
        .callFunction({
          name: 'property',
          data: {
            name: 'initType',
            data: params,
          },
        })
        .then((res) => {
          let { data } = res.result;
		  if(data!=''){
			this.oldCategory = data;
			this.category = data.map((item) => {
			  return item.category_name;
			});
			_this.app.property_device_category_id = this.oldCategory[0]._id  
		  }
         
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    bindPickerChange(e) {
      this.app.status = e.target.value;
    },
    bindChange(e) {
	  if(this.oldCategory!=''){
		this.category_index = e.target.value;
		this.app.property_device_category_id = this.oldCategory[this.category_index]._id;  
	  }
    },
    submit() {
      if (this.app.property_device_category_id == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写库设备名称!',
        });
        return;
      } else if (this.app.device_model == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写设备型号!',
        });
        return;
      } else if (this.app.buy_date == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写选择购买日期!',
        });
        return;
      } else if (this.app.price == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写价格!',
        });
        return;
      } else if (this.app.repair_year == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写保修年限!',
        });
        return;
      } else if (this.app.repair_end_date == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写保修结束时间!',
        });
        return;
      } else if (this.app.maintainer == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写维护商!',
        });
        return;
      } else if (this.app.maintainer_tel == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写维护商电话',
        });
        return;
      }

      const params = this.app;
	  uni.showLoading();
      uniCloud
        .callFunction({
          name: 'property',
          data: {
            name: 'propertyAdd',
            data: params,
          },
        })
        .then((res) => {
          uni.hideLoading();
          if (res.result != null) {
            this.data = res.result.data;
            this.total = res.result.total;
          }
		  uni.showToast({
		    icon: 'none',
		    title: '入库成功.',
			duration:1500,
		  });
		  this.app.property_device_category_id = '';
		  this.app.device_model = '';
		  this.app.buy_date = '';
		  this.app.price = '';
		  this.app.repair_year = '';
		  this.app.repair_end_date = '';
		  this.app.maintainer = '';
		  this.app.maintainer_tel = '';
		  this.app.status=0;
		  this.GetCategory()
		 // setTimeout(() => {
		 // 	uni.navigateTo({
		 // 	  url: '/pagesOA/property/index1',
		 // 	});
		 // }, 2000)
        
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    chenge() {
      this.$emit('chenge');
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #ffffff;
  display: block;
  font-size: 26rpx;
  font-weight: medium;
}

.equipment {

  font-weight: 500;
  text-align: left;
  position: relative;
  height: calc(100vh - 0px);
    /* #ifdef MP */
    padding: 0 25rpx 25rpx 25rpx;
    /* #endif */
  .relation-item {
    width: calc(100vw - 50rpx);
    height: 140rpx;
    padding: 0 25rpx 25rpx 25rpx;
  }
  .relation-item-last {
    width: calc(100vw - 50rpx);
    height: 140rpx;
	/* #ifdef H5 || APP*/
	padding: 0 25rpx 25rpx 25rpx;
	 /* #endif */
  }
  .tall {
    height: 170rpx;
    position: relative;
  }
  .printer {
    font-size: 30rpx;
  }

  .equipment-item {
    color: #e5000000;
    font-family: PingFang;
    line-height: normal;
    text-align: left;
  }
  .icon {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    top: 40rpx;
    left: 200rpx;
  }
}
textarea {
  width: 698rpx;
  height: 50rpx;
  padding: 0rpx;
  border-bottom: 1px solid #cccccc;
  position: relative;
}

.picker {
  width: 698rpx;
}

.guarantee {
  width: 182rpx;
  height: 30rpx;
  font-size: 28rpx;
  padding: 10rpx 0rpx 22rpx;
}

.repairs {
  position: relative;
}
.Icons {
  position: absolute;
  bottom: 388rpx;
  right: 100rpx;
}

.Maintenance {
  width: 100%;
  height: 36rpx;
  font-size: 28rpx;
  padding: 10rpx 0rpx 22rpx;
}

.state {
  margin-bottom: 15rpx;
}
.use {
  width: 698rpx;
  height: 50rpx;
  border-bottom: 1px solid #cccccc;
  font-size: 30rpx;
  position: relative;
  .use-icon {
    width: 70rpx;
    height: 70rpx;
    position: absolute;
    top: -25rpx;
    right: 0rpx;
  }
}

.button {
position: fixed;
bottom: 0;
left: 0;
padding: 14rpx 0;

width: 750rpx;
background-color: #ffffff;
}

button {
  width: 698rpx;
  height: 104rpx;
  line-height: 104rpx;
  text-align: center;
  color: #ffffff;
  background-color: #3b88f5;
  text-align: center;
  font-size: 12pt;
}
.input {
  color: rgba(0, 0, 0, 0.9);
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 30rpx;
  text-align: left;
  border-bottom: 1px solid #cccccc;
  width: 698rpx;
  padding-bottom: 20rpx;
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
}
.relation-item-mp{
	/* #ifdef MP */
	padding-bottom: 160rpx;
	/* #endif */
	/* #ifdef APP-PLUS */
	padding-bottom: 120rpx;
	/* #endif */
	
}
</style>
