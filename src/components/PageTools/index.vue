<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="$slots.before" class="before">
          <i class="el-icon-info" />
          <!-- 定义前面得插槽 -->
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="序号" width="100" type="index">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="200">
      </el-table-column>
      <el-table-column label="头像" width="200">
        <template v-slot="{ row }">
          <el-avatar
            :src="row.staffPhoto"
            style="width: 100px; height: 100px"
            @click.native="showCanvas(row.staffPhoto)"
          >
            <img src="@/assets/common/img.jpeg" alt="" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="workNumber" label="工号" width="200">
      </el-table-column>
      <el-table-column
        prop="formOfEmployment"
        label="聘用形式"
        width="200"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column prop="departmentName" label="部门名称" width="200">
      </el-table-column>
      <el-table-column label="入职时间" width="200">
        <template v-slot="{ row }">
          {{ row.correctionTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="zip" label="账户状态" width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template v-slot="{ row }">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/employees/detail/${row.id}`)"
            >查看</el-button
          >
          <el-button type="text" size="small">转正</el-button>
          <el-button type="text" size="small">调岗</el-button>
          <el-button type="text" size="small">离职</el-button>
          <el-button type="text" size="small" @click="changeJueSe(row.id)"
            >角色</el-button
          >
          <el-button
            type="text"
            size="small"
            :disabled="checkPermission('DELETE_USER')"
            @click="delEmployee(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" align="middle" style="height: 60px">
      <el-pagination
        layout="prev, pager, next"
        :page-size="page.size"
        :current-page="page.page"
        :total="total"
        @current-change="changePage"
      />
    </el-row>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <AssignRole
      ref="assignRoleRef"
      :show-assign-role.sync="showAssignRole"
      :current-id="currentId"
    ></AssignRole>
  </el-card>
</template>

<script>
import AssignRole from '@/views/employees/components/assign-role.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import QrCode from 'qrcode'
import { maxin } from '@/utils/maxin'
export default {
  name: 'PageTools',
  components: {
    AssignRole
  },
  mixins: [maxin],
  data () {
    return {
      showCodeDialog: false,
      showAssignRole: false,
      tableData: [],
      total: 0,
      currentId: '',
      page: {
        page: 1, // 当前页码
        size: 10
      }
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      const res = await getEmployeeList(this.page)
      // console.log(res)
      this.tableData = res.rows
      this.total = res.total
      // console.log(this.total)
    },
    changePage (page) {
      // console.log(page)
      this.page.page = page
      console.log(this.page.page)
      this.getEmployeeList()
    },
    formatter (row, column, cellValue) {
      // console.log(row, 94)
      // console.log(column, 95)
      // console.log(row, 96)
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)?.value
      return obj || '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('是否要删除?')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    },
    showCanvas (row) {
      console.log(row)
      this.showCodeDialog = true
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, row)
      })
    },
    async changeJueSe (id) {
      this.currentId = id
      await this.$refs.assignRoleRef.getUserDetailById(id)
      this.showAssignRole = true
    }
  }
}
</script>

<style lang='scss'>
.page-tools {
  margin: 10px 0;
  .before {
    line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>

