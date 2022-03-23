<template>
  <scroll-view scroll-x="true">
    <view class="bot-bottom">
      <view class="add-box" @click="chooseAndUploadFile"
        ><image
          src="../../../../static/email/ico_data_@3x.png"
          mode="scaleToFill"
          class="add"
      /></view>
      <view class="little-box" v-for="item in list" :key="item.title">
        <view class="img-box"
          ><image
            src="../../../../static/email/ico_data.png"
            mode="scaleToFill"
            class="img"
        /></view>
        <view class="title">
          <view class="title-name">{{ item.name }}</view>
          <view class="title-ext">.{{ item.ext }}</view>
        </view>
        <view class="capacity">{{ item.size }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  watch: {
    list() {
      this.handleFile();
    },
  },
  methods: {
    handleFile() {
      this.$emit("file", this.list);
    },
    /* ---------------上传附件--------------- */
    chooseAndUploadFile(file) {
      uniCloud
        .chooseAndUploadFile({
          extension: [".doc", ".xlsx", "xls", ".docx", "ppt", "pptx"],
          onChooseFile: (res) => {
            const processAll = [];
            for (let i = 0; i < res.tempFiles.length; i++) {
              processAll.push(this.cropImg(res.tempFiles[i]));
            }
            return Promise.all(processAll).then((fileList) => {
              let result = {
                tempFilePaths: [],
              };
              result.tempFiles = fileList.map((fileItem, index) => {
                result.tempFilePaths.push(fileItem);
                let reg = new RegExp(`.${fileItem.ext}`);
                let name = fileItem.name.replace(reg, "");
                let size =
                  fileItem.size / 1024 < 1024
                    ? (fileItem.size / 1024).toFixed(1) + "KB"
                    : (fileItem.size / 1024 / 1024).toFixed(1) + "M";
                return {
                  size,
                  name,
                  ext: fileItem.ext,
                  path: fileItem.path,
                  cloudPath: "" + Date.now() + index + "." + fileItem.ext, // 云端路径，这里随便生成了一个
                  fileType: fileItem.fileType,
                };
              });
              return result;
            });
          },
        })
        .then((res) => {
          const tempFiles = res.tempFiles;
          this.list.unshift(tempFiles[0]);
          this.$emit("file", this.list);
        })
        .catch((err) => {
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    cropImg(file) {
      return new Promise((resolve, reject) => {
        let ext;
        let filePathProcessed = file.path; // 处理结果
        // #ifdef H5
        ext = file.name.split(".").pop();
        resolve({
          path: filePathProcessed,
          ext,
          fileType: file.type,
          size: file.size,
          name: file.name,
        });
        // #endif
        // #ifndef H5
        // uni.getImageInfo({
        // 	src: file.path,
        // 	success(info) {
        // 		ext = info.type.toLowerCase()
        // 		resolve({
        // 			path: filePathProcessed,
        // 			ext,
        // 			fileType: file.fileType,
        // 			size:file.size
        // 		})
        // 	},
        // 	// fail(err) {
        // 	// 	reject(new Error(err.errMsg || '未能获取文件类型'))
        // 	// }
        // })
        // #endif
      });
    },
    /* 删除图片 */
    deleteImg(index) {
      var that = this;
      uni.showModal({
        content: "删除这个文件？",
        success(res) {
          if (res.confirm) {
            that.list.splice(index, 1);
            that.$emit("file", that.list);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bot-bottom {
  width: 100vw;
  height: 288rpx;
  display: flex;
  margin: 38rpx 0 0 40rpx;
  // .show{
  //   animation: show .4s;
  // }
  // .hidden{
  //   animation: hidden .4s;
  // }
  .add-box {
    width: 144rpx;
    min-width: 144rpx;
    height: 144rpx;
    border-radius: 6rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    .add {
      width: 72rpx;
      height: 72rpx;
    }
  }
  .little-box {
    border-radius: 6rpx;
    display: flex;
    flex-direction: column;
    margin-left: 40rpx;
    align-items: center;
    .img-box {
      background: rgba(255, 255, 255, 1);

      width: 144rpx;
      height: 144rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .img {
        width: 72rpx;
        height: 72rpx;
      }
    }
    .capacity,
    .title {
      color: rgba(0, 0, 0, 0.9);
      font-family: PingFang SC;
      font-weight: medium;
      font-size: 22rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: center;
    }
    .title {
      display: flex;
      .title-name {
        width: 84rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
