<template>
  <a-modal
    :title="modalProp.title"
    :width="700"
    :visible="visible"
    :dialog-style="{ top: '20px' }"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" disabled="true">
        <a-row>
          <a-col span="24">
            <a-form-item label="父级菜单" :label-col="{span:3}" :wrapper-col="{span:21}">
              <a-tree-select
                :disabled="parentTreeDisabled"
                v-decorator="menuForm.parentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="menus"
                :replace-fields="{children:'children',title:'title',key:'id',value:'id'}"
                placeholder="请选择父级菜单"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="排 序" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input-number style="width: 100%" :min="0" :max="9999" v-decorator="menuForm.orderNo"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <span slot="label">
                状态&nbsp;
                <a-tooltip title="关闭状态不会显示在侧边栏且无法访问">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </span>
              <a-switch v-decorator="menuForm.status"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="12">
            <a-form-item label="类 型" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-radio-group v-decorator="menuForm.type" :options="genderOptions">
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="currentMenuType !== 'B'">
            <a-form-item label="菜单图标" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="menuForm.icon">
                <a-icon slot="addonAfter" type="setting"/>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <div v-if="currentMenuType === 'F'">
          <a-row>
            <a-col span="12">
              <a-form-item label="菜单标题" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input
                  v-decorator="menuForm.title"/>
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
              <a-form-item label="重定向地址" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input v-decorator="menuForm.redirect"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="隐藏" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-switch v-decorator="menuForm.hidden"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="隐藏子菜单" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-switch v-decorator="menuForm.hideChildrenInMenu"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <span slot="label">
                隐藏面包屑
                <a-tooltip title="特殊 隐藏 PageHeader 组件中的页面带的 面包屑和页面标题栏">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </span>
                <a-switch v-decorator="menuForm.hiddenHeaderContent"/>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div v-else-if="currentMenuType === 'M'">
          <a-row>
            <a-col span="12">
              <a-form-item label="菜单标题" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input
                  v-decorator="menuForm.title"/>
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
              <a-form-item label="路由组件" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input v-decorator="menuForm.component"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="路由路径" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input v-decorator="menuForm.path"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="权限标识" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input v-decorator="menuForm.permission"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="隐藏" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-switch v-decorator="menuForm.hidden"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <span slot="label">
                路由缓存
                <a-tooltip title="开启后页面不显示面包屑">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </span>
                <a-switch v-decorator="menuForm.keepAlive"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="新窗口" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-switch v-decorator="menuForm.newWindow"/>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div v-else>
          <a-row>
            <a-col span="12">
              <a-form-item label="菜单标题" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input
                  v-decorator="menuForm.title"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="权限标识" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
                <a-input v-decorator="menuForm.permission"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col span="24">
              <a-form-item label="权限URL" :help="permissionUrlHelp" :label-col="{span:3}" :wrapper-col="{span:21}">
                <a-input-group compact>
                  <a-select placeholder="所属服务" v-model="permissionUrl.service" style="width: 20%"
                            :options="servicesOptions">
                  </a-select>
                  <a-select placeholder="请求方式" v-model="permissionUrl.method" style="width: 20%"
                            :options="requestMethodOptions">
                  </a-select>
                  <a-input style="width: 60%" v-model="permissionUrl.url" @change="formatUrl" placeholder="/user/"/>
                </a-input-group>
              </a-form-item>
            </a-col>

          </a-row>
        </div>

        <a-row>
          <a-col :span="24">
            <a-form-item label="备 注" :label-col="{span:3}" :wrapper-col="{span:21}">
              <a-textarea v-decorator="menuForm.remark"/>
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
import {TreeSelect} from 'ant-design-vue'
import IconSelector from '@/components/IconSelector'
import {add, edit, getMenuById} from '@/api/system/menu'
import pick from 'lodash.pick'

const icons = ['plus-circle', 'check-circle'];
const titles = ['新增', '编辑', '查看'];

export default {
  name: 'MenuModal',
  props: ['menus'],
  components: {
    ATreeSelect: TreeSelect,
    IconSelector
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formData: {},
      iconSelectVisible: false,
      modalProp: {
        title: '',
        btnIcon: ''
      },
      permissionUrl: {
        service: undefined,
        method: undefined,
        url: ''
      },
      currentMenuType: 'F',
      // todo 替换为 字典值
      genderOptions: [{label: '目录', value: 'F'}, {label: '菜单', value: 'M'}, {label: '按钮', value: 'B'}],
      servicesOptions: [{label: '系统服务', value: 'cloud-leaf-admin'}, {label: '博客服务', value: 'cloud-leaf-blog'}],
      requestMethodOptions: [{label: '不限', value: '*'}, {label: 'GET', value: 'GET'}, {
        label: 'POST',
        value: 'POST'
      }, {label: 'PUT', value: 'PUT'}, {label: 'DELETE', value: 'DELETE'}, {label: 'PATCH', value: 'PATCH'}],
      id: null,
      parentTreeDisabled: false,
      layout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
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
        path: ['path',
          {
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
          }],
        orderNo: ['orderNo',
          {
            rules: [{required: true, message: '请输入菜单排序'},
            ],
          }],
        icon: ['icon', {}],
        permission: ['permission',
          {
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
          }],
        hidden: ['hidden', {valuePropName: 'checked', initialValue: false}],
        status: ['status', {valuePropName: 'checked', initialValue: true}],
        hideChildrenInMenu: ['hideChildrenInMenu', {valuePropName: 'checked', initialValue: false}],
        type: ['type', {
          initialValue: 'F',
          getValueFromEvent: e => {
            let val = e.target.value
            this.currentMenuType = val
            return val
          }
        }],
        keepAlive: ['keepAlive', {valuePropName: 'checked', initialValue: true}],
        hiddenHeaderContent: ['hiddenHeaderContent', {valuePropName: 'checked', initialValue: false}],
        newWindow: ['newWindow', {valuePropName: 'checked', initialValue: false}],
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
  computed: {
    permissionUrlHelp: function () {
      let res = (this.permissionUrl.method || '') + ':/' + (this.permissionUrl.service || '') + this.permissionUrl.url
      return res === ':/' ? '' : res
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
  },
  methods: {
    add(parentId) {
      if (parentId) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.parentTreeDisabled = true;
            this.form.setFieldsValue({parentId: parentId})
          }, 0)
        })
      }

      this.modalProp.title = titles[0]
      this.modalProp.btnIcon = icons[0]
      this.visible = true
    },
    edit(id) {
      this.formData.id = id
      this.id = id
      this.modalProp.title = titles[1]
      this.modalProp.btnIcon = icons[1]
      this.visible = true
      getMenuById(id).then(resp => {
        let type = resp.data.type
        this.currentMenuType = type
        this.$nextTick(() => {
            if ('F' === type) {
              this.form.setFieldsValue(pick(resp.data, 'title', 'name', 'parentId', 'icon', 'redirect', 'orderNo', 'hidden', 'hideChildrenInMenu', 'type', 'hiddenHeaderContent', 'status', 'remark'))
            } else if ('M' === type) {
              this.form.setFieldsValue(pick(resp.data, 'title', 'name', 'parentId', 'icon', 'type', 'component', 'path', 'orderNo', 'permission', 'hidden', 'keepAlive', 'newWindow', 'status', 'remark'))
            } else {
              if (resp.data.permissionUrl){
                let pArr = resp.data.permissionUrl.split(':/')
                this.permissionUrl.method = pArr[0]
                const idx = pArr[1].indexOf('/')
                this.permissionUrl.service = pArr[1].substring(0,idx)
                this.permissionUrl.url = pArr[1].substring(idx)
              }
              this.form.setFieldsValue(pick(resp.data, 'title', 'parentId', 'orderNo', 'permission', 'hidden', 'type', 'status', 'remark'))

            }
        })
      })

    },
    trimInput(e) {
      return e.target.value.trim()
    },
    view(id) {
      this.modalProp.title = titles[2]
      this.$nextTick(() => {
      })
      this.visible = true
    },
    formatUrl() {
      if (this.permissionUrl.url && this.permissionUrl.url.trim() && !this.permissionUrl.url.trim().startsWith('/')) {
        this.permissionUrl.url = '/' + this.permissionUrl.url.trim()
      }
    },
    close() {
      this.visible = false
      this.parentTreeDisabled = false
      this.id = null
      this.form.resetFields()
      this.currentMenuType = 'F'
      this.permissionUrl = {
        service: undefined,
        method: undefined,
        url: ''
      }
    },

    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.id = this.id
          _this.confirmLoading = true
          values.permissionUrl = this.permissionUrlHelp
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
  watch: {}
}
</script>
