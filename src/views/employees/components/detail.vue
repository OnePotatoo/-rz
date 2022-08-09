<template>
  <div>
    <el-card style="margin: 0 30px">
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <el-form
            ref="userForm"
            label-width="120px"
            :model="formData"
            :rules="rules"
            class="form"
          >
            <el-form-item label="姓名" prop="username">
              <el-input
                v-model="formData.username"
                style="width: 20%"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input
                v-model="formData.password2"
                style="width: 20%"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserDetailById"
                >跟新</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="个人详情">
          <!-- 放置岗位详情 -->
          <component :is="UserInfo"></component>
        </el-tab-pane>
        <el-tab-pane label="岗位详情">
          <!-- 放置岗位详情 -->
          <component :is="JobInfo"></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  name: 'APP',
  components: {
    UserInfo,
    JobInfo
  },
  data () {
    return {
      formData: {},
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        password2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 9,
            message: '密码长度6-9位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserDetailById()
    // console.log(this.$route.params.id)
  },
  methods: {
    async getUserDetailById () {
      this.formData = await getUserDetailById(this.$route.params.id)
      // console.log(this.formData, 91)
    },
    async saveUserDetailById () {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById(
          {
            ...this.formData,
            password: this.formData.password2
          }
        ) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.form {
  margin: 50px auto;
}
</style>
