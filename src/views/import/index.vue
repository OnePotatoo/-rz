<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
// console.log(2222222222222222222222)
const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}
export default {
  name: 'Import',
  methods: {
    async onSuccess ({ results }) {
      const newArr = results.map(item => {
        const obj = {}
        for (const itemKey in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[itemKey])) {
            obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/')) // 只有这样, 才能入库
          } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      console.log(newArr)
      await importEmployee(newArr)
      this.$message.success('提交成功')
      this.$router.back()
    },
    // excel中的时间是一个数字，需要调用此方法进行处理 -> 直接复制
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
