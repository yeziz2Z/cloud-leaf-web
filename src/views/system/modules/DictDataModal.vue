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
        <a-form-item label="字典类型">
          <a-input :disabled="true" v-decorator="['type',{rules:[{}]}]"/>
        </a-form-item>
        <a-form-item label="数据标签">
          <a-input
            v-decorator="['label',
                {rules:[{required:true,message:'请输入字典数据标签',whitespace:true}],
                getValueFromEvent: e =>{ return e.target.value.trim()},
                trigger:'blur',
                validateTrigger:'blur'
                }]"/>
        </a-form-item>
        <a-form-item label="数据值">
          <a-input v-decorator="['value',
               {rules:
                 [
                   {required:true,message:'请录入字典数据值'},
                 ],
                trigger:'change',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
               }
               ]"/>
        </a-form-item>
        <a-form-item label="显示排序">
          <a-input-number v-decorator="['sort',
              {
                rules:[{required:true,message:'请输入显示排序'} ],
              }]"/>
        </a-form-item>
        <a-form-item label="状 态">
          <a-radio-group v-decorator="['status', {initialValue:'1'}]" :options="statusOptions">
          </a-radio-group>
        </a-form-item>

        <a-form-item label="备 注">
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
import {addDictData, editDictData, getDictDataById} from '@/api/system/dict'

export default {
  name: 'DictDataModal',
  data() {
    return {
      modalProp: {
        title: '',
        btnIcon: '',
        footVisible: true
      },
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 12},
      },
      visible: false,
      confirmLoading: false,
      mdl: {},
      id: null,
      form: this.$form.createForm(this),
      statusOptions: [{label: '正常', value: '1'}, {label: '停用', value: '0'}],
    }
  },
  created() {
  },
  methods: {
    add(type) {
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({type: type})
      })
    },
    edit(id) {
      this.id = id
      this.visible = true
      getDictDataById(id).then(resp => {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(resp.data, 'type', 'label', 'value', 'sort', 'status', 'remark'))
        })
      })

    },
    close() {
      this.$emit('close')
      this.visible = false
      this.id = null
      this.form.resetFields()
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          values.id = this.id
          if (values.id) {
            editDictData(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('修改成功')
                _this.$emit('ok', values.type)
                _this.close()
              } else {
                _this.$message.error(resp.msg, 3)
              }
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              _this.confirmLoading = false
            })
          } else {
            addDictData(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('添加成功')
                _this.$emit('ok', values.type)
                _this.close()
              } else {
                _this.$message.error(resp.msg, 3)
              }

            }).catch(err => {
              _this.$message.error(resp.msg, 3)
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
