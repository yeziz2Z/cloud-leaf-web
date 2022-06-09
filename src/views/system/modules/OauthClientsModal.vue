<template>
  <a-modal
    :title="modalProp.title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" disabled="true">
        <a-row>
          <a-col span="12">
            <a-form-item label="客户端ID" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input
                v-decorator="rules.clientId"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="客户端密钥" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input
                v-decorator="rules.clientSecret"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="域" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="rules.scope"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="自动放行" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-switch v-decorator="rules.autoApprove"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="认证令牌时效" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="rules.accessTokenValidity"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="刷新令牌时效" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="rules.refreshTokenValidity"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="回调地址" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="rules.webServerRedirectUri"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权限" :label-col="layout.labelCol" :wrapper-col="layout.wrapperCol">
              <a-input v-decorator="rules.authorities"/>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="扩展信息" :label-col="{span:3}" :wrapper-col="{span:20}">
              <a-textarea placeholder="JSON格式" v-decorator="rules.additionalInformation"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="授权方式" :label-col="{span:3}" :wrapper-col="{span:21}">
              <a-checkbox-group v-decorator="['authorizedGrantTypes', {}]" :options="authorizedGrantTypesOptions">
              </a-checkbox-group>
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
import {add, edit, getClientById, checkClientId} from '@/api/system/oauthClients'
import {dictDataOptions} from '@/api/system/dict'
import pick from "lodash.pick";

const icons = ['plus-circle', 'check-circle'];
const titles = ['新增', '编辑', '查看'];

export default {
  name: 'OauthClientModal',

  data() {
    return {
      visible: false,
      confirmLoading: false,
      mdl: {},
      authorizedGrantTypesOptions: [],
      modalProp: {
        title: '',
        btnIcon: '',
        footVisible: true
      },
      layout: {
        labelCol: {span: 6},
        wrapperCol: {span: 16}
      },
      // 表单校验规则
      rules: {
        clientId: [
          'clientId', {
            rules: [
              {required: true, message: '请输入客户端ID', whitespace: true},
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    return
                  }
                  this.checkClientId(value, callback)
                },
                message: '客户端Id已存在'
              }],
            getValueFromEvent: e => {
              return e.target.value.trim()
            },
            trigger: 'blur',
            validateTrigger: 'blur'
          }
        ],
        clientSecret: ['clientSecret',
          {
            rules: [{required: true, message: '请输入客户端密钥', whitespace: true}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        scope: ['scope',
          {
            rules: [{}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        autoApprove: ['autoApprove', {valuePropName: 'checked', initialValue: true}],
        accessTokenValidity: ['accessTokenValidity',
          {
            rules: [{type: 'integer', message: '请输入正确的有效时间 单位:s', transform: val => Number(val)}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        refreshTokenValidity: ['refreshTokenValidity',
          {
            // 设置 type 为  number 需要添加  transform 进行转换
            rules: [{type: 'number', message: '请输入正确的有效时间 单位:s', transform: val => Number(val)}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        webServerRedirectUri: ['webServerRedirectUri',
          {
            rules: [{}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        authorities: ['authorities',
          {
            rules: [{}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],
        additionalInformation: ['additionalInformation',
          {
            rules: [{}],
            getValueFromEvent: e => this.trimInput(e),
            trigger: 'blur',
            validateTrigger: 'blur'
          }],

      }
    }
  },
  beforeCreate() {

    dictDataOptions('grant_type').then(res =>{
      this.authorizedGrantTypesOptions = res.data
    }).catch(err =>{
      this.authorizedGrantTypesOptions = []
    })

    this.form = this.$form.createForm(this)
  },
  created() {
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
      this.modalProp.title = titles[1]
      this.modalProp.btnIcon = icons[1]
      // 先渲染页面  才能赋值
      this.visible = true
      getClientById(id).then(res => {
        this.$nextTick(() => {
          res.data.autoApprove = res.data.autoApprove === 1 ? true : false
          if (res.data.authorizedGrantTypes) {
            res.data.authorizedGrantTypes = res.data.authorizedGrantTypes.split(',')
          } else {
            res.data.authorizedGrantTypes = []
          }
          this.form.setFieldsValue(pick(res.data,
            'clientId',
            'clientSecret',
            'scope',
            'autoApprove',
            'accessTokenValidity',
            'refreshTokenValidity',
            'webServerRedirectUri',
            'authorities',
            'additionalInformation',
            'authorizedGrantTypes'))
        })
      })

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
    checkClientId(clientId, callback) {
      checkClientId({id: this.id, clientId: clientId}).then(res => {
        if (res.code === 200) {
          callback()
        } else {
          callback(res.msg)
        }
      })
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.id = this.id
          _this.confirmLoading = true
          values.autoApprove = values.autoApprove ? 1 : 0
          values.authorizedGrantTypes = values.authorizedGrantTypes.join(',')
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
    },
    trimInput(e) {
      return e.target.value.trim()
    }
  },

}
</script>
