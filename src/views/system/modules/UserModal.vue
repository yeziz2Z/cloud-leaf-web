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
          <a-col span="12">
            <a-form-item label="用户昵称" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-input
                v-decorator="['nickName',
                {rules:[{required:true,message:'请输入用户昵称',whitespace:true}],
                getValueFromEvent: e =>{ return e.target.value.trim()},
                trigger:'blur',
                validateTrigger:'blur'
                }]"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="所属机构" :label-col="{span:6}" :wrapper-col="{span:16}">
              <!--              <a-input v-decorator="['orgId', {rules:[{required: true}]}]"  />-->
              <a-tree-select
                v-decorator="['orgId', {rules:[{required: true,message:'请选择组织机构'}]}]"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="orgTree"
                :replace-fields="{children:'children',title:'title',key:'key',value:'key'}"
                placeholder="请选择机构"
              >
                <!--                <template #title="{ key, value }">
                                  <span style="color: #08c" v-if="key === '0-0-1'">Child Node1 {{ value }}</span>
                                </template>-->
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="手机号码" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-input v-decorator="['mobilePhone',
               {rules:
                 [
                   {required:true,message:'请输入手机号'},
                   {pattern:/^1[3|4|5|7|8]\d{9}$/,message:'请输入正确格式手机号!'},
                 ],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
               }
               ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮 箱" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-input v-decorator="['email', {rules:[{type:'email',message:'请输入正确邮件格式'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-show="id === null">
          <a-col :span="12">
            <a-form-item label="用户名称" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-input v-decorator="['username',
              {
                rules:[
                  {required:true,message:'请输入用户名称'},
                  {min:4,message:'最小长度为4'},
                  {max:12,message:'最大长度为12'},
                  ],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
              }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密 码" :label-col="{span:4,offset:2}" :wrapper-col="{span:16}">
              <a-input-password v-decorator="['password',
              {
                rules:
                [
                  {required:id === null,message:'请输入密码'}
                ],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
              }]"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="性 别" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-radio-group v-decorator="['gender', {initialValue:'0'}]" :options="genderOptions">
                <!--                <a-radio :value="1">男</a-radio>
                                <a-radio :value="2">女</a-radio>-->
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状 态" :label-col="{span:6}" :wrapper-col="{span:16}">
              <a-switch v-decorator="['status', {valuePropName:'checked'}]"/>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备 注" :label-col="{span:3}" :wrapper-col="{span:20}">
              <a-textarea v-decorator="['remark',
              {
                rules:[{max:100,message:'长度限制100'}],
                trigger:'blur',
                validateTrigger:'blur',
                getValueFromEvent: e =>{ return e.target.value.trim()}
              }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="用户角色" :label-col="{span:3}" :wrapper-col="{span:21}">
              <a-checkbox-group v-decorator="['roleIds', {}]" :options="roleOptions">
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
import {TreeSelect} from 'ant-design-vue'
import {add, edit, getUserById} from '@/api/system/user'
import {dictDataOptions} from '@/api/system/dict'

const icons = ['plus-circle', 'check-circle'];
const titles = ['新增', '编辑', '查看'];

export default {
  name: 'UserModal',
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
      genderOptions: [],
      id: null,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', {})
    dictDataOptions('sys_user_sex').then((res) => {
      this.genderOptions = res.data
    })
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
