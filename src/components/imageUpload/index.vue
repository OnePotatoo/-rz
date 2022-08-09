<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{ completed: isComplete }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :limit="1"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="isProgress"
      :percentage="percentage"
      style="width: 200px"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDpUt1tUoreAPN5XidHfneW8TXJp42jAKD',
  SecretKey: 'e18yXopZ1C7l8E3cuvf9LGuIPFn45pIU'
})
export default {
  name: 'ImageUpload',
  data () {
    return {
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      isProgress: false,
      fileList: [
        {
          url: 'https://img0.baidu.com/it/u=2996686052,921577239&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
      ]
    }
  },
  computed: {
    isComplete () {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(fileList) // 删除后的结果
      this.fileList = fileList
      // this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeFile (file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList
    },
    beforeUpload (file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大')
        return false
      }
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件格式不符合')
        return false
      }
      this.isProgress = true
    },
    upload ({ file }) {
      // console.log(file, 75)
      cos.putObject({
        Bucket: '958182321-1313213553', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file,
        StorageClass: 'STANDARD',
        onProgress: (params) => {
          // console.log(params)
          this.percentage = params.percent * 100
        }
      },
        (err, data) => {
          // console.log(err)
          // console.log(data)
          if (err) {
            this.$message.error(err?.message || '上传出错了')
            return
          }
          this.fileList.forEach((item) => {
            // console.log(item.url)
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`
            }
            item.upload = true
          })
        })
      setTimeout(() => {
        this.isProgress = false
        this.percentage = 0
      }, 1500)
    }
  }
}
</script>

<style scoped lang='scss'>
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
