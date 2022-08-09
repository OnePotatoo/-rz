<template>
  <el-row
    type="flex"
    justify="space-between"
    class="el-title"
    style="width: 100%"
  >
    <el-col :span="18">
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <span>{{ treeData.manager }}</span>
    </el-col>
    <el-col :span="4">
      <el-dropdown @command="operateDepts">
        <span class="el-dropdown-link">
          操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">添加部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="edit"
            >编辑部门</el-dropdown-item
          >
          <el-dropdown-item v-if="!isRoot" command="del"
            >删除部门</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeData: {
      required: true, // 设置当前数据为必填
      type: Object // 类型是Object
    },
    isRoot: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    async operateDepts (type) {
      if (type === 'add') {
        // console.log(1)
        this.$emit('handleAddDepts', this.treeData) // 触发弹层
      } else if (type === 'edit') {
        // console.log(2)
        this.$emit('getEdit', this.treeData) // 触发弹层
      } else {
        // console.log(3)
        await this.$confirm('确定删除吗?')
        // console.log(this.$confirm())
        // 删除部门
        await delDepartments(this.treeData.id)
        this.$emit('getDepartments')
        this.$message.success('删除成功！')
      }
    }
  }

}
</script>

<style>
</style>
