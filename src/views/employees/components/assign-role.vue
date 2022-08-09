<template>
  <el-dialog title="分配角色" :visible="showAssignRole" @close="close">
    <el-checkbox-group v-model="roleid">
      <el-checkbox v-for="(item, index) in list" :key="index" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="end">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',

  props: {
    showAssignRole: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      roleid: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    close () {
      this.roleid = []
      this.$emit('update:showAssignRole', false)
    },
    async btnOk () {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleid || []
        })
        this.$message.success('修改成功')
        this.close()
      } catch (e) {
        this.$message.error('修改失败')
        console.log(e)
        this.close()
      }
    },
    async getRoleList () {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById (id) {
      const { roleIds = [] } = await getUserDetailById(id)
      // console.log(res)
      this.roleid = roleIds
    }
  }
}
</script>

