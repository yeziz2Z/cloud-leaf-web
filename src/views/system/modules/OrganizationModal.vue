<template>
  <a-modal
    :title="modalProp.title"
    :width="666"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" disabled="true">
        <a-row>
          <a-col span="24">
            <a-form-item
              label="上级机构"
              v-show="getFormFieldValue('parentId') !== 0"
              :label-col="{span:3}"
              :wrapper-col="{span:21}">
              <a-tree-select
                v-decorator="organizationForm.parentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="organizations"
                :replace-fields="{children:'children',title:'name',key:'id',value:'id'}"
                placeholder="请选择上级机构"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col span="12">
            <a-form-item label="部门名称" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="organizationForm.name"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排 序" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input-number style="width: 100%" :min="0" :max="9999" v-decorator="organizationForm.orderNo"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col span="12">
            <a-form-item label="负责人" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="organizationForm.leader"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="organizationForm.phone"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="12">
            <a-form-item label="邮箱" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="organizationForm.email"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-select :options="statusOptions" v-decorator="organizationForm.status"></a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="备 注" :label-col="{span:3}" :wrapper-col="{span:21}">
              <a-textarea v-decorator="organizationForm.remark"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>

    </a-spin>
    <template #footer>
      <a-button key="back" icon="close-circle" @click="handleCancel">取消</a-button>
      <a-button key="submit" :icon="modalProp.btnIcon" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import { add, edit, getOrganizationById } from '@/api/system/org'
import { dictDataOptions } from '@/api/system/dict'
import pick from 'lodash.pick'
import clonedeep from 'lodash.clonedeep'

const icons = ['plus-circle', 'check-circle']
const titles = ['新增', '编辑', '查看']

export default {
  name: 'OrganizationModal',
  props: ['organizations'],
  components: {
    ATreeSelect: TreeSelect
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      modalProp: {
        title: '',
        btnIcon: ''
      },
      id: null,
      parentTreeDisabled: false,
      isTopOrganization: false,
      statusOptions: [],
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      organizationForm: {
        name: ['name',
          {
            rules: [
              { required: true, message: '请输入机构名称', whitespace: true },
              {
                validator: (rule, value, callback) => {
                  if (this.isRepeatOrganizationName(value)) {
                    callback('repeat organization name.')
                  }
                  callback()
                },
                message: '组织机构名称已存在'
              }
            ],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        leader: ['leader',
          {
            rules: [{}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        phone: ['phone',
          {
            rules: [{ pattern: /^1[3|4|5|7|8]\d{9}$/, message: '请输入正确格式手机号!' }],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        email: ['email',
          {
            rules: [{ type: 'email', message: '请输入正确邮件格式' }],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        parentId: ['parentId',
          {
            rules: [{ required: true, message: '请选择父级机构' }]
          }],
        orderNo: ['orderNo',
          {
            rules: [{ required: true, message: '请输入排序' }
            ]
          }],
        status: ['status', { rules: [{ required: true, message: '请选择组织机构状态' }] }],
        remark: ['remark',
          {
            rules: [{ max: 100, message: '长度限制100' }],
            trigger: 'blur',
            validateTrigger: 'blur',
            getValueFromEvent: e => this.trimInput(e)
          }]
      }
    }
  },
  computed: {},
  beforeCreate () {
    dictDataOptions('sys_status').then(res => {
      this.statusOptions = res.data
    })
    this.form = this.$form.createForm(this)
  },
  created () {
  },
  methods: {
    add (parentId) {
      if (parentId) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.parentTreeDisabled = true
            this.form.setFieldsValue({ parentId: parentId })
          }, 0)
        })
      }

      this.modalProp.title = titles[0]
      this.modalProp.btnIcon = icons[0]
      this.visible = true
    },
    getFormFieldValue (name) {
      return this.form.getFieldValue(name)
    },
    isRepeatOrganizationName (value) {
      const parentId = this.getFormFieldValue('parentId')
      if (parentId === null) {
        return false
      }
      // 广度遍历树结构
      const queue = clonedeep(this.organizations)
      while (queue.length !== 0) {
        const size = queue.length
        for (let i = 0; i < size; i++) {
          const org = queue.shift()
          if (parentId === org.id && org.children && org.children.some(o => {
            return value === o.name && this.id !== o.id
          })) {
            return true
          }
          if (org.children) {
            org.children.forEach(e => queue.push(e))
          }
        }
      }
      return false
    },
    edit (id) {
      this.id = id
      this.$nextTick(() => {
        getOrganizationById(id).then(resp => {
          this.form.setFieldsValue(pick(resp.data, 'name', 'parentId', 'orderNo', 'leader', 'phone', 'email', 'status', 'remark'))
        })
      })
      this.modalProp.title = titles[1]
      this.modalProp.btnIcon = icons[1]
      this.visible = true
    },
    trimInput (e) {
      return e.target.value.trim()
    },
    view (id) {
      this.modalProp.title = titles[2]
      this.$nextTick(() => {
      })
      this.visible = true
    },
    close () {
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
          values.id = this.id
          _this.confirmLoading = true
          if (values.id) {
            edit(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('修改成功')
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.error(resp.msg)
              }
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              _this.confirmLoading = false
            })
          } else {
            add(values).then(resp => {
              if (resp.code === 200) {
                _this.$message.success('添加成功')
                _this.$emit('ok')
                _this.close()
              }
            }).catch(err => {
              _this.$message.error(err)
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }

}
</script>
