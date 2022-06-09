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
            <a-form-item label="字典名称"  >
              <a-input
                v-decorator="['name',
                {rules:[{required:true,message:'请输入字典名称',whitespace:true}],
                getValueFromEvent: e =>{ return e.target.value.trim()},
                trigger:'blur',
                validateTrigger:'blur'
                }]"/>
            </a-form-item>
            <a-form-item label="字典类型"  >
              <a-input v-decorator="['type',
               {rules:
                 [
                   {required:true,message:'请录入字典类型'},
                 ],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
               }
               ]"/>
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
import {addDictType, editDictType, getDictTypeById,dictDataOptions} from '@/api/system/dict'

export default {
  name: 'DictTypeModal',
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
      statusOptions: [],
    }
  },
  beforeCreate() {
    dictDataOptions('sys_status').then(res =>{
      this.statusOptions = res.data
    })
  },
  created () {
  },
  methods: {
    add () {
      this.visible = true
    },
    edit (id) {
      this.id = id
      getDictTypeById(id).then(resp =>{
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(resp.data, 'name', 'type', 'status', 'remark'))
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
          _this.confirmLoading = true
          values.id = this.id
          if (values.id){
            editDictType(values).then(resp => {
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
            addDictType(values).then(resp => {
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

  }
}
</script>

<style scoped>

</style>
