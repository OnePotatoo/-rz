<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共166条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="mini" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button size="mini" type="warning" @click="isshowDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
    </div>
    <AddDemployee :isshow-dialog.sync="isshowDialog"></AddDemployee>
  </div>
</template>

<script>
/* webpackChunkName:'hello'*/
import AddDemployee from '@/views/employees/components/add-employee.vue'
import { getEmployeeList } from '@/api/employees'

import EmployeeEnum from '@/api/constant/employees'

export default {
  components: {
    AddDemployee
  },
  props: {
    isshowDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    async exportExcel () {
      const res = await import('@/utils/exportexcel')
      // console.log(res)

      const result = await getEmployeeList()
      // console.log(result)

      const rows = result.rows
      // console.log(rows, 48888)
      // const total = result.total
      // console.log(total)

      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      // console.log(Object.keys(headers))

      this.formatJson(headers, rows)

      res.export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: this.data, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },

    formatJson (headers, rows) {
      const res = rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return this.formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          // console.log(headers[key], 83333)
          // console.log(item[headers[key]], 83)
          return item[headers[key]]
        })
      })
      // console.log(res, 80)
      this.data = res
      // console.log(this.data, 88)
    },
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

<style>
</style>

