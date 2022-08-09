<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户管理" name="first">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showDialog = true"
              >新增角色</el-button
            >
            <div class="table">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="120">
                </el-table-column>
                <el-table-column prop="name" label="角色名称" width="240">
                </el-table-column>
                <el-table-column prop="description" label="描述">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row }">
                    <el-button
                      size="small"
                      type="success"
                      @click="assignPermCilck(row.id)"
                      >分配权限</el-button
                    >
                    <el-button size="small" type="primary" @click="edit(row.id)"
                      >编辑</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="deleteRole(row.id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-row type="flex" justify="center">
              <el-pagination
                background
                :page-size="page.pagesize"
                layout="prev, pager, next"
                :total="total"
                style="margin-top: 20px"
                @current-change="changeCurrent"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top: 20px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog
        :title="`${roleForm.id ? '编辑' : '新增'}`"
        :visible="showDialog"
        @close="close"
      >
        <el-form ref="role" :model="roleForm" :rules="rules">
          <el-form-item label="角色" label-width="100px" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="roleForm.description" />
          </el-form-item>
          <el-row type="flex" justify="center">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="btnOk"> 确定</el-button>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- 权限 -->
      <el-dialog
        :visible="showRoleDialog"
        title="设置权限"
        @close="closePermission"
      >
        <el-tree
          ref="eltreeRef"
          :data="permissionList"
          :props="props"
          :show-checkbox="true"
          :check-strictly="true"
          :default-expand-all="true"
          node-key="id"
          :default-checked-keys="checkedKeys"
        ></el-tree>
        <template #footer>
          <el-button size="mini" @click="closePermission">取消</el-button>
          <el-button size="mini" type="primary" @click="btnPermissionOk"
            >确定</el-button
          >
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { transListToTreeNew } from '@/utils/index'
import { getPermissionList, assignPerm } from '@/api/permisson'
export default {
  data () {
    return {
      showDialog: false,
      showRoleDialog: false, // 分配权限
      activeName: 'first',
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true, message: '角色名称不能为空', trigger: 'blur'
          }
        ]
      },
      tableData: [],
      page: {
        pagesize: 10,
        page: 1
      },
      total: 0,
      formData: {},
      props: {
        label: 'name'
      },
      permissionList: [],
      checkedKeys: [],
      currentId: null
    }
  },
  created () {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnPermissionOk () {
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      const permIdsList = this.$refs.eltreeRef.getCheckedKeys()
      // console.log(permIdsList)
      await assignPerm({
        id: this.currentId,
        permIds: permIdsList
      })
      this.$message.success('分配权限成功')
      this.closePermission()
    },
    // 权限
    async assignPermCilck (id) {
      this.currentId = id
      // 拿到树形列表数据
      this.permissionList = transListToTreeNew(await getPermissionList(), '0')
      // 拿到默认的选中
      const { permIds } = await getRoleDetail(id)
      this.checkedKeys = permIds
      this.showRoleDialog = true
    },
    async getRoleList () {
      const { rows, total } = await getRoleList(this.page)
      // console.log(rows)
      // console.log(total)
      this.tableData = rows
      this.total = total
    },
    changeCurrent (page) {
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo () {
      const res = await getCompanyInfo(this.$store.getters.companyId)
      // console.log(res)
      this.formData = transListToTreeNew(res, '0')
    },
    async deleteRole (id) {
      const len = this.tableData.length
      await this.$confirm('确认删除该角色吗')
      await deleteRole(id)
      this.$message.success('删除角色成功')
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      await this.getRoleList()
    },
    close () {
      this.showDialog = false
      this.$refs.role.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    closePermission () {
      this.showRoleDialog = false
      this.checkedKeys = []
    },
    async edit (id) {
      this.showDialog = true
      const res = await getRoleDetail(id)
      console.log(res)
      this.roleForm = res
    },
    async btnOk () {
      await this.$refs.role.validate()
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
        this.$message.success('修改成功')
      } else {
        await addRole(this.roleForm)
        this.$message.success('添加成功')
      }
      await this.getRoleList()
      this.close()
    }
  }
}
</script>

<style lang='scss' scoped>
.table {
  margin-top: 20px;
}
</style>

