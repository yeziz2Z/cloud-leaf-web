<template>
  <a-modal
    :title="modalProp.title"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" disabled="true">
        <a-row>
          <a-col span="12">
            <a-form-item label="菜单标题" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input
                v-decorator="['title',
                {rules:[{required:true,message:'请输入用户昵称',whitespace:true}],
                getValueFromEvent: e =>{ return e.target.value.trim()},
                trigger:'blur',
                validateTrigger:'blur'
                }]"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="菜单编码" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input
                v-decorator="menuForm.name"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="父级菜单" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input disabled v-decorator="menuForm.parentId"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由组件" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="menuForm.component"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="菜单图标" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="menuForm.icon">
                <a-icon slot="addonAfter" type="setting" />
              </a-input>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row >
          <a-col :span="12">
            <a-form-item label="重定向地址" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="menuForm.redirect"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排 序" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input-number style="width: 100%" v-decorator="menuForm.orderNo"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="隐藏" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="menuForm.hidden"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状 态" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="menuForm.status"/>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="强制菜单显示" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="menuForm.hideChildrenInMenu"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="类 型" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-radio-group v-decorator="menuForm.type" :options="genderOptions">
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="图标" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-radio-group v-decorator="['gender', {initialValue:'0'}]" :options="genderOptions">
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="隐藏面包屑" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="menuForm.hiddenHeaderContent"/>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="路由缓存" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="menuForm.keepAlive"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权限标识" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="menuForm.permission"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="备 注" :label-col="{span:3}" :wrapper-col="{span:20}">
              <a-textarea v-decorator="menuForm.remark"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>

    </a-spin>
    <template #footer v-show="modalProp.footVisible">
      <a-button key="back" icon="close-circle" @click="handleCancel">取消</a-button>
      <a-button key="submit" :icon="modalProp.btnIcon" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import {TreeSelect} from 'ant-design-vue'
import {add, edit, getUserById} from '@/api/system/user'

const icons = ['plus-circle', 'check-circle'];
const titles = ['新增', '编辑', '查看'];

export default {
  name: 'MenuModal',
  props: ['orgTree', 'roleOptions'],
  components: {
    ATreeSelect: TreeSelect
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      mdl: {},
      modalProp: {
        title: '',
        btnIcon: '',
        footVisible: true
      },
      genderOptions: [{label: '男', value: '0'}, {label: '女', value: '1'}, {label: '未知', value: '2'}],
      id: null,
      layout: {
        labelCol: {span: 7},
        wrapperCol: {span: 15}
      },
      menuForm: {
        title: ['title',
          {
            rules: [{required: true, message: '请输入菜单标题', whitespace: true}],
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        name: ['name',
          {
            rules: [{required: true, message: '请输入菜单编码', whitespace: true}],
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        parentId: ['parentId',
          {
            rules: [{required: true, message: '请选择父级菜单'}],
          }],
        component: ['component',
          {
            rules: [{required: true, message: '请输入路由组件', whitespace: true}],
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        redirect: ['redirect',
          {
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
          }],
        orderNo: ['orderNo',
          {
            rules: [{required: true, message: '请输入菜单排序'}],
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        icon: ['icon', {}],
        permission: ['permission',
          {
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
          }],
        hidden: ['hidden', {valuePropName:'checked'}],
        status: ['status', {valuePropName:'checked'}],
        hideChildrenInMenu: ['hideChildrenInMenu', {valuePropName:'checked'}],
        type: ['type', {}],
        keepAlive: ['keepAlive', {}],
        hiddenHeaderContent: ['hiddenHeaderContent', {valuePropName:'checked'}],
        newWindow: ['newWindow', {valuePropName:'checked'}],
        remark: ['remark',
          {
            rules: [{max: 100, message: '长度限制100'}],
            trigger: 'blur',
            validateTrigger: 'blur',
            getValueFromEvent: e => {
              return e.target.value.trim()
            }
          }]
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', {})
  },
  created() {
    console.log('roles::', this.roles)
  },
  methods: {
    add() {
      this.modalProp.title = titles[0]
      this.modalProp.btnIcon = icons[0]
      this.modalProp.footVisible = true
      this.visible = true
    },
    edit(id) {
      this.id = id
      getUserById(id).then(res => {
        let formVal = res.data

        this.$nextTick(() => {
          // TODO 表单无法正常回显  需要加一个定时任务
          setTimeout(() => {
            this.form.setFieldsValue({
              nickName: formVal.nickName,
              orgId: formVal.organization.id,
              mobilePhone: formVal.mobilePhone,
              email: formVal.email,
              username: formVal.username,
              // password: formVal.password,
              gender: formVal.gender,
              status: formVal.status,
              remark: formVal.remark,
              roleIds: formVal.roles.map((key) => {
                return key.id
              })
            })
          }, 0)
        })
        this.modalProp.title = titles[1]
        this.modalProp.btnIcon = icons[1]
        this.modalProp.footVisible = true
        this.visible = true
      })

    },
    trimInput(e) {
      return e.target.value.trim()
    },
    view(id) {
      this.modalProp.title = titles[2]
      this.$nextTick(() => {
        this.modalProp.footVisible = false
      })
      this.visible = true
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
          values.id = this.id
          console.log('form values', values)

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
              _this.$message.error(resp.msg)
            }).finally(() => {
              _this.confirmLoading = false
            })
          }

        }
      })
    },
    handleCancel() {
      this.close()
    }
  },
  watch: {
    /*id: function (id) {
      this.$nextTick(() => {
        this.form.validateFields(['password'], {force: true});
      })
    }*/
  }
}
</script>
