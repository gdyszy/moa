<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="题目">
        <uni-easyinput placeholder="题目" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="option_type" label="类型">
        <uni-data-checkbox v-model="formData.option_type" @change="change"
          :localdata="formOptions.option_type_localdata">
        </uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item v-if="formData.option_type!=2" label="选项">
        <HM-dragSorts :feedbackGeneratorState="false" :list="formData.toption" :isLongTouch="false" :rowHeight="55" @changinput="changinput(arguments)" @change="changes" @confirm="confirm"
          @onclick="onclick">
        </HM-dragSorts>
        <button type="primary" @click="btnClick" size="mini" style="margin: 10rpx;">
          <uni-icons type="plusempty" color="white"></uni-icons>
          追加
        </button>
      </uni-forms-item>
      <uni-forms-item name="survey_id" label="所属问卷">
        <uni-data-picker v-model="formData.survey_id" collection="survey" orderby="name asc"
          field="_id as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="status" label="状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="weigh" label="权重">
        <uni-easyinput placeholder="权重" type="number" v-model="formData.weigh"></uni-easyinput>
      </uni-forms-item>
      <view class="status_bar">
        <button type="default" class="submit" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import {
    validator
  } from '../js_sdk/validator/survey-problem.js';
  import dragSorts from '@/uni_modules/HM-dragSorts/components/HM-dragSorts/HM-dragSorts.vue'
  // import draggable from "vuedraggable";
  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'survey-problem';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  export default {
    components: {
      'HM-dragSorts': dragSorts
    },
    data() {
      let formData = {
        "title": "",
        "option_type": 0,
        "survey_id": "",
        "toption": [{
          content: ""
        }, {
          content: ""
        }],
        "status": 0,
        "weigh": 0
      }
      return {
        formData,
        props: {
          lable: "content"
        },
        formOptions: {
          "option_type_localdata": [{
              "text": "单选题",
              "value": 0
            },
            {
              "text": "多选题",
              "value": 1
            },
            {
              "text": "文本题",
              "value": 2
            }
          ],
          "status_localdata": [{
              "text": "关闭",
              "value": 0
            },
            {
              "text": "开启",
              "value": 1
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      onclick(e) {
        this.formData.toption.splice(e.index, 1)
      },
      changinput(item){
        this.formData.toption[item[1]].content=item[0].content
      },
      changes(e) {
      },
      confirm(e) {
        let a=this.formData.toption[e.index]
        this.formData.toption.splice(e.index,1)
        this.formData.toption.splice(e.moveTo,0,a)
        console.log(this.formData.toption)
        // console.log('原始下标：', e.index);
        // console.log('移动到：', e.moveTo);
        // console.log(this.formData.toption)
      },
      change(e) {
        if (e.detail.data.value === 2) {
          this.formData.toption = [{
            content: ""
          }, {
            content: ""
          }]
        }
      },
      btnClick() {
        this.formData.toption.push({
          content: ""
        })
      },
      deleteItem(item, index) {
        this.formData.toption.splice(index, 1)
      },
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {}).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        this.formData.toption.forEach((item, index) => {
          item["index"] = index
        })
        value["toption"] = this.formData.toption
        // console.log(value)
        // return false
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
<style>
  .uni-container {
    padding: 5rpx 20rpx 100rpx 20rpx;
  }

  .parent {
    width: 530rpx;
    display: flex;
  }

  .itemLeft {
    margin: 10rpx 30rpx 10rpx 0;
  }

  .itemRight {
    margin-top: 13rpx;
    height: 70rpx;
    width: 180rpx;
    display: flex;
  }

  .deleteItem {
    margin-right: 20rpx;
  }

  .status_bar {
    position: fixed;
    height: 140rpx;
    z-index: 10;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
