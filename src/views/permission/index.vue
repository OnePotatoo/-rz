<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <el-card style="margin-bottom: 20px">
        <el-row type="flex" justify="end">
          <el-button type="primary" size="small" @click="addPermission('0', 1)"
            >添加权限</el-button
          >
        </el-row>
      </el-card>
      <!-- 表格 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
            >
              添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="showDialog" @close="close">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input
            v-model="formData.description"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="formData.enVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="btnOk">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { transListToTreeNew } from '@/utils/index'
export default {
  name: 'Permisson',
  data () {
    return {
      list: [],
      showDialog: false,
      formData: {},
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title () {
      return this.formData.id ? '编辑' : '添加'
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    // 编辑
    async editPermission (id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除
    async delPermission (id) {
      await this.$confirm('确定要删除吗?')
      await delPermission(id)
      this.$message.success('删除成功')
      this.getPermissionList()
    },
    async getPermissionList () {
      this.list = transListToTreeNew(await getPermissionList(), '0')
      console.log(this.list)
    },
    addPermission (pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    close () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.showDialog = false
    },
    async btnOk () {
      this.$refs.form.validate()
      try {
        if (this.formData.id) {
          await updatePermission({
            ...this.formData

          })
        } else {
          await addPermission({
            ...this.formData
          })
        }
        this.$message.success(`${this.title}成功~`)
        this.getPermissionList()
        this.close()
      } catch (e) {
        console.log(e)
        this.$message.error('添加失败')
      }
    }
  }
}
</script>

<style>
</style>

