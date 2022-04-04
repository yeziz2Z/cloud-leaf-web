<template>
  <a-modal
    title="操作"
    :width="550"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" v-bind="formItemLayout">
<!--        :lable-col="labelCol" :wrapper-col="wrapperCol"-->
            <a-form-item label="角色名称"  >
              <a-input
                v-decorator="['name',
                {rules:[{required:true,message:'请输入角色名称',whitespace:true}],
                getValueFromEvent: e =>{ return e.target.value.trim()},
                trigger:'blur',
                validateTrigger:'blur'
                }]"/>
            </a-form-item>
            <a-form-item label="角色编码"  >
              <a-input v-decorator="['code',
               {rules:
                 [
                   {required:true,message:'角色编码'},
                 ],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
               }
               ]"/>
            </a-form-item>

            <a-form-item label="角色顺序"  >
              <a-input-number v-decorator="['orderNo',
              {
                rules:[
                  {required:true,message:'请输入用户名称'},
                  ],
              }]"/>
            </a-form-item>
            <a-form-item label="状 态" >
              <a-radio-group v-decorator="['status', {initialValue:'1'}]" :options="statusOptions">
              </a-radio-group>
            </a-form-item>

            <a-form-item label="备 注" >
              <a-textarea v-decorator="['remark',
              {
                rules:[{max:100,message:'长度限制100'}],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
              }]"/>
            </a-form-item>
      </a-form>

    </a-spin>
    <template #footer>
      <a-button key="back" icon="close-circle" @click="close">取消</a-button>
      <a-button key="submit" :icon="modalProp.btnIcon" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {add, edit, getRoleById} from '@/api/system/role'

export default {
  name: 'RoleModal',
  data () {
    return {
      modalProp: {
        title: '',
        btnIcon: '',
        footVisible: true
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      visible: false,
      confirmLoading: false,
      mdl: {},
      id: null,
      form: this.$form.createForm(this),
      statusOptions: [{label: '正常', value: '1'}, {label: '停用', value: '0'}],
    }
  },
  created () {
  },
  methods: {
    add () {
      this.visible = true
    },
    edit (id) {
      this.id = id
      getRoleById(id).then(resp =>{
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(resp.data, 'name', 'code', 'orderNo', 'status', 'remark'))
        })
      })
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.id = null
      this.form.resetFields()
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('form values', values)

          _this.confirmLoading = true
          values.id = this.id
          if (values.id){
            edit(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('修改成功')
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.error(resp.msg,3)
              }
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              _this.confirmLoading = false
            })
          }else {
            add(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('添加成功')
                _this.$emit('ok')
                _this.close()
              }else {
                _this.$message.error(resp.msg,3)
              }

            }).catch(err => {
              _this.$message.error(resp.msg,3)
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        }
      })
    },
    onChangeCheck (permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll (e, permission) {
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
  }
}
</script>

<style scoped>

</style>
