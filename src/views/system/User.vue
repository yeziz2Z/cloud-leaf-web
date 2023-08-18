<template>
  <a-card :bordered="false">
    <a-row :gutter="8">

      <a-col :span="5">
        <a-card>
          <a-tree default-expand-all v-if="orgTree.length > 0" :tree-data="orgTree" @select="handleClick"/>
        </a-card>
      </a-col>

      <a-col :span="19">
        <a-card>
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="用户名">
                    <a-input v-model="queryParam.name" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="手机号">
                    <a-input v-model="queryParam.phone" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="状态">
                    <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                      <a-select-option value="0">全部</a-select-option>
                      <a-select-option value="1">关闭</a-select-option>
                      <a-select-option value="2">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24"></a-col>
                <a-col :md="8" :sm="24"></a-col>
                <a-col :md="8" :sm="24">
                  <span
                    class="table-page-search-submitButtons"
                    :style=" { float: 'right', overflow: 'hidden' } ">
                    <a-button
                      type="primary"
                      icon="search"
                      v-permission="'system.user.list'"
                      @click="refresh">查询</a-button>
                    <a-button style="margin-left: 8px" icon="reload" @click="() => this.queryParam = {}">重置</a-button>

                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" v-permission="'system.user.add'" @click="handleAdd">新建</a-button>
            <a-button icon="edit" :disabled="ids.length !== 1" v-permission="'system.user.edit'" @click="handleEdit">
              编辑
            </a-button>
            <a-button icon="eye" :disabled="ids.length !== 1" @click="handleView">查看</a-button>
            <a-button
              type="danger"
              :disabled="ids.length === 0"
              v-permission="'system.user.delete'"
              icon="delete"
              @click="handleDelete">删除
            </a-button>

          </div>
          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="getUserList"
            :alert="false"
            :pagination="{ showTotal: total => `共 ${total} 条` }"
            :showPagination="true"
            :rowKey="record => record.id"
            :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
          >

            <template #roles="roles">
              <a-tag v-for="(role) in roles " :color="colors[Math.floor(Math.random()*6)]" :key="role.id">{{
                role.name
              }}</a-tag>
            </template>
            <template #status="text, record">
              <a-popconfirm
                ok-text="是"
                cancel-text="否"
                @confirm="confirmHandleStatus(record)"
                @cancel="cancelHandleStatus(record)"
              >
                <span slot="title">确认<b>{{ record.status ? '停用' : '启用' }}</b>{{ record.nickName }}的用户吗?</span>
                <a-switch checked-children="启用" un-checked-children="停用" :checked="record.status"/>
              </a-popconfirm>
            </template>
            <template #action="text, record">
              <template>
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多 <a-icon type="down"/>
                </a>
                <a-menu slot="overlay">

                  <a-menu-item>
                    <a @click="handleResetPassword(record)">重置密码</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleDelete(record)" v-permission="'system.user.delete'">删除</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </s-table>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      title="重置密码"
      :width="500"
      :visible="resetPwd.visible"
      :confirmLoading="resetPwd.confirmLoading"
      @ok="handlerRestModalOk"
      @cancel="handlerRestModalCancel">
      <a-form :form="resetPwd.form">

        <p>请输入用户「{{ resetPwd.username }}」的新密码</p>
        <a-popover
          placement="rightTop"
          :trigger="['focus']"
          :getPopupContainer="(trigger) => trigger.parentElement"
          v-model="resetPwd.state.passwordLevelChecked">
          <template #content>
            <div :style="{ width: '200px' }">
              <div :class="['reset-password', passwordLevelClass]">{{ passwordLevelName }}</div>
              <a-progress :percent="resetPwd.state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
              <div style="margin-top: 10px;">
                <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
              </div>
            </div>
          </template>
          <a-form-item>
            <a-input-password
              :maxLength="16"
              @click="() => this.resetPwd.state.passwordLevelChecked = true"
              placeholder="请至少输入 6 个字符。请不要使用容易被猜到的密码。"
              v-decorator="['password', {rules: [{ required: true, message: '请输入密码！' },
                                                 { validator: this.handlePasswordLevel }],
                                         validateTrigger: ['change', 'blur']}]"
            ></a-input-password>
          </a-form-item>
        </a-popover>
      </a-form>
    </a-modal>
    <user-modal :orgTree="orgTree" :roleOptions="roleOptions" ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import UserModal from './modules/UserModal'
import { getOrgTree } from '@/api/system/org'
import { list, remove, resetPassword } from '@/api/system/user'
import { getRoles } from '@/api/system/role'
import { Tree } from 'ant-design-vue'
import {encrypt, scorePassword} from '@/utils/util'

const levelNames = {
  0: '强度：太短',
  1: '强度：低',
  2: '强度：中',
  3: '强度：强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'User',
  components: {
    STable,
    // MTree,
    UserModal,
    ATree: Tree
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '登录账号',
          dataIndex: 'username'
        },
        {
          title: '用户姓名',
          dataIndex: 'nickName',
          sorter: true,
          needTotal: true
        },
        {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        },
        {
          title: '部门',
          dataIndex: 'organization.name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        /* {
          title: '手机号',
          dataIndex: 'mobilePhone',
          sorter: true
        }, */
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      orgTree: [],
      roleOptions: [],
      ids: [],
      selectedRows: [],
      colors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
      resetPwd: {
        form: this.$form.createForm(this),
        visible: false,
        confirmLoading: false,
        userId: null,
        username: '',
        state: {
          level: 0,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        }
      }
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.resetPwd.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.resetPwd.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.resetPwd.state.passwordLevel]
    }
  },
  created () {
    getOrgTree().then(res => {
      this.orgTree = res.data
    })
    getRoles().then(res => {
      this.roleOptions = res.data.map((role, idx) => {
        return { label: role.name, value: role.id }
      })
    })
  },
  methods: {
    handleClick (key, e) {
      console.log(e)
      this.queryParam.orgId = key.length ? key[0] : null
      this.refresh()
    },
    refresh () {
      this.$refs.table.refresh(true)
    },
    handleResetPassword (record) {
      this.resetPwd.userId = record.id
      this.resetPwd.username = record.username
      this.resetPwd.visible = true
    },
    handlePasswordLevel (rule, value, callback) {
      if (value === '') {
        return callback()
      }
      if (value.length >= 6) {
        const score = scorePassword(value)
        if (score >= 30) {
          this.resetPwd.state.level = 1
        }
        if (score >= 60) {
          this.resetPwd.state.level = 2
        }
        if (score >= 80) {
          this.resetPwd.state.level = 3
        }
      } else {
        this.resetPwd.state.level = 0
        callback(new Error('密码强度不够'))
      }
      this.resetPwd.state.passwordLevel = this.resetPwd.state.level
      this.resetPwd.state.percent = this.resetPwd.state.level * 33

      callback()
    },
    getUserList (parameter) {
      if (!parameter) {
        const page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }
      return list(Object.assign(parameter, this.queryParam))
        .then(res => {
          return res.data
        }).finally(() => {
          this.clearSelected()
        })
    },
    confirmHandleStatus (row) {
      console.log('确认')
    },
    cancelHandleStatus (row) {
      console.log('取消')
    },
    handleAdd (item) {
      this.$refs.modal.add(item.key)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record.id || this.ids[0])
    },
    handleView (record) {
      this.$refs.modal.view(record.id || this.ids[0])
    },
    handleDelete (record) {
      const userIds = record.id || this.ids
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + userIds + '的数据',
        onOk () {
          return remove(userIds)
            .then(resp => {
              if (resp.code === 200) {
                _this.$message.success('删除成功', 3)
                _this.refresh()
              } else {
                _this.$message.error(resp.msg)
              }
            })
        },
        onCancel () {
        }
      })

      /* remove(userIds).then(resp => {
        if (resp.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error(resp.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      }) */
    },
    handleTitleClick (item) {
    },
    titleClick (e) {
    },
    handleSaveOk () {
      this.ids = []
      this.refresh()
    },
    handleSaveClose (e) {
    },
    clearSelected () {
      this.ids = []
      this.selectedRows = []
    },
    onSelectChange (ids, selectedRows) {
      this.ids = ids
      this.selectedRows = selectedRows
    },
    handlerRestModalOk () {
      // 触发表单验证
      this.resetPwd.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.userId = this.resetPwd.userId
          console.log('form values', values)
          values.password = encrypt(values.password)
          this.resetPwd.confirmLoading = true
          resetPassword(values).then(resp => {
            if (resp.code === 200) {
              this.$message.success('修改成功')
              this.handlerRestModalCancel()
            } else {
              this.$message.error(resp.msg)
            }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.resetPwd.confirmLoading = false
          })
        }
      })
    },

    handlerRestModalCancel () {
      this.resetPwd.state = {
        passwordLevelChecked: false,
        level: 0,
        percent: 10,
        passwordLevel: 0,
        progressColor: '#FF0000'
      }

      this.resetPwd.visible = false
      this.resetPwd.userId = null
      this.resetPwd.form.resetFields()
    }
  }
}
</script>

<style lang="less">

.reset-password {

  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }

}

.custom-tree {

  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
