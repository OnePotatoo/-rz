<template>
  <el-dialog
    :title="`${showTitle}部门`"
    :visible="isShowAddDept"
    @close="close"
  >
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="formData.manager" placeholder="请选择"></el-input> -->
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          placeholder="1-300个字符"
        ></el-input>
      </el-form-item>
    </el-form>
    <template>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'ADD',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: null
    }
  },
  data () {
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let currentNodeChilren
      if (this.formData.id) {
        currentNodeChilren = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id)
      } else {
        currentNodeChilren = depts.filter(item => item.pid === this.currentNode.id)
      }
      const isRepeat = currentNodeChilren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject(new Error('部门名称重复'))
      }
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isRepeat = depts.some(item => (item.code === value))
      }
      if (isRepeat) {
        return Promise.reject('部门code重复')
      }
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑' : '添加'
    }
  },
  methods: {
    // 编辑
    async getDepartDetail (id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple () {
      this.options = await getEmployeeSimple()
      // console.log(this.options)
    },
    async submit () {
      // console.log(this.$refs.form)
      if (this.formData.id) {
        // 修改编辑
        await updateDepartments(this.formData)
      } else {
        // 添加
        await this.$refs.form.validate()
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      // console.log(res)
      this.$message.success(`${this.showTitle}成功`)
      this.$emit('getDepartments')
      this.close()
    },
    close () {
      this.$refs.form.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$emit('update:isShowAddDept', false)
    }
  }
}

</script>

<style>
</style>
