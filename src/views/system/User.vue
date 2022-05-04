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
                  <span class="table-page-search-submitButtons"
                        :style=" { float: 'right', overflow: 'hidden' }  ">
                    <a-button type="primary" icon="search" v-permission="'system.user.list'" @click="refresh">查询</a-button>
                    <a-button style="margin-left: 8px" icon="reload" @click="() => this.queryParam = {}">重置</a-button>

                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" v-permission="'system.user.add'" @click="handleAdd">新建</a-button>
            <a-button icon="edit" :disabled="ids.length !== 1" v-permission="'system.user.edit'" @click="handleEdit">编辑</a-button>
            <a-button icon="eye" :disabled="ids.length !== 1" @click="handleView">查看</a-button>
            <a-button type="danger" :disabled="ids.length === 0" v-permission="'system.user.delete'" icon="delete" @click="handleDelete">删除</a-button>

          </div>
          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="getUserList"
            :alert="false"
            :pagination="{ showTotal: total => `共 ${total} 条` }"
            :showPagination='true'
            :rowKey='record => record.id'
            :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
          >

            <span slot="roles" slot-scope="text,record">
              <a-tag v-for="(role) in text " :color="colors[Math.floor(Math.random()*6)]" :key="role.id">{{ role.name }}</a-tag>
            </span>
            <span slot="status" slot-scope="text, record">
              <a-popconfirm
                ok-text="是"
                cancel-text="否"
                @confirm="confirmHandleStatus(record)"
                @cancel="cancelHandleStatus(record)"
              >
                <span slot="title">确认<b>{{ record.status ? '停用' : '启用' }}</b>{{ record.nickName }}的用户吗?</span>
                <a-switch checked-children="启用" un-checked-children="停用" :checked="record.status"/>
              </a-popconfirm>
            </span>
            <span slot="action" slot-scope="text, record">
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
                  <a href="javascript:;">重置密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleDelete(record)" v-permission="'system.user.delete'">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
          </s-table>
        </a-card>
      </a-col>
    </a-row>

    <user-modal :orgTree="orgTree" :roleOptions="roleOptions" ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import UserModal from './modules/UserModal'
import {getOrgTree, getServiceList, getRoles} from '@/api/manage'
import {remove} from '@/api/system/user'
import {Tree} from 'ant-design-vue'

export default {
  name: 'User',
  components: {
    STable,
    // MTree,
    UserModal,
    ATree: Tree
  },
  data() {
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
          needTotal: true,
        },
        {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: {customRender: 'roles' }
        },
        {
          title: '部门',
          dataIndex: 'organization.name',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
        },
        /*{
          title: '手机号',
          dataIndex: 'mobilePhone',
          sorter: true
        },*/
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      orgTree: [],
      roleOptions: [],
      ids: [],
      selectedRows: [],
      colors : ['pink','red','orange','green','cyan','blue','purple']
    }
  },
  created() {
    getOrgTree().then(res => {
      this.orgTree = res.data
    })
    getRoles().then(res => {
      this.roleOptions = res.data.map((role, idx) => {
        return {label: role.name, value: role.id}
      })
    })
  },
  methods: {
    handleClick(key, e) {
      console.log(e)
      this.queryParam.orgId = key.length ? key[0] : null
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh(true)
    },
    resetPassword(){

    },

    getUserList(parameter) {
      if (!parameter) {
        let page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }
      return getServiceList(Object.assign(parameter, this.queryParam))
        .then(res => {
          return res.data
        })
    },
    confirmHandleStatus(row) {

    },
    cancelHandleStatus(row) {

    },
    handleAdd(item) {
      console.log('add button, item', item)
      this.$refs.modal.add(item.key)
    },
    handleEdit(record) {
      this.$refs.modal.edit(record.id || this.ids[0])
    },
    handleView(record) {
      this.$refs.modal.view(record.id || this.ids[0])
    },
    handleDelete(record) {
      const userIds = record.id || this.ids
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + userIds + '的数据',
        onOk () {
          return remove(userIds)
            .then(resp => {
              if (resp.code === 200) {
                _this.$message.success('删除成功',3)
                _this.refresh()
              } else {
                _this.$message.error(resp.msg)
              }

            })
        },
        onCancel () {}
      })

      /*remove(userIds).then(resp => {
        if (resp.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error(resp.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })*/
    },
    handleTitleClick(item) {
      console.log('handleTitleClick', item)
    },
    titleClick(e) {
      console.log('titleClick', e)
    },
    handleSaveOk() {
      this.ids = []
      this.refresh()
    },
    handleSaveClose(e) {
      console.log("handleSaveClose", e)
    },

    onSelectChange(ids, selectedRows) {
      this.ids = ids
      this.selectedRows = selectedRows
      console.log(this.ids)
    }
  }
}
</script>

<style lang="less">
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
