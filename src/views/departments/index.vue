<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="card">
        <!-- 树形结构 -->
        <TreeTool
          :tree-data="company"
          :is-root="true"
          @handleAddDepts="handleAddDepts"
        ></TreeTool>
        <el-tree
          class="el-tree"
          default-expand-all
          :data="departs"
          :props="defaultProps"
        >
          <template v-slot="{ data }">
            <TreeTool
              :tree-data="data"
              :is-root="false"
              @getDepartments="getDepartments"
              @handleAddDepts="handleAddDepts"
              @getEdit="getEdit"
            ></TreeTool>
          </template>
        </el-tree>
      </el-card>
    </div>
    <ADDdept
      ref="addDept"
      :is-show-add-dept.sync="isShowAddDept"
      :current-node="currentNode"
      @getDepartments="getDepartments"
    ></ADDdept>
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/tree-tools.vue'
import ADDdept from '@/views/departments/components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils/index'
export default {
  components: {
    TreeTool,
    ADDdept
  },
  data () {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
      { name: '行政部', manager: '刘备' },
      { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      isShowAddDept: false,
      currentNode: {},
      loading: false
    }
  },
  created () {
    this.getDepartments()
  },
  methods: {
    // 按添加出现弹层
    handleAddDepts (node) {
      this.isShowAddDept = true
      this.currentNode = node
    },
    // 按编辑出现弹层
    getEdit (node) {
      this.isShowAddDept = true
      this.currentNode = node
      this.$refs.addDept.getDepartDetail(node.id)
    },
    // handleNodeClick (data) {
    //   console.log(data)
    // },

    // 获取部门列表
    async getDepartments () {
      try {
        this.loading = true
        // console.log(1)
        const res = await getDepartments()
        // console.log(res.depts)
        this.company = {
          name: res.companyName,
          manager: res.companyManage || '负责人',
          id: ''
        }
        // console.log(res.depts)
        this.departs = transListToTreeNew(res.depts, '')
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .card {
    width: 800px;
    margin: 0 auto;
    .el-tree {
      margin-top: 10px;
    }
  }
}
</style>

