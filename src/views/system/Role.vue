<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色编码">
              <a-input v-model="queryParam.code" placeholder="请输入"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" icon="search" v-permission="'system.role.list'" @click="refresh">查询</a-button>
                <a-button style="margin-left: 8px" icon="reload" @click="reset">重置</a-button>
              </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" v-permission="'system.role.add'" @click="handleAdd">新建</a-button>
      <a-button icon="edit" :disabled="ids.length !== 1" @click="handleEdit" v-permission="'system.role.edit'">修改
      </a-button>
      <a-button type="danger" :disabled="ids.length === 0" icon="delete" @click="handleDelete"
                v-permission="'system.role.delete'">删除
      </a-button>

    </div>
    <s-table
      ref="table"
      size="default"
      :rowKey='record => record.id'
      :pagination="{ showTotal: total => `共 ${total} 条` }"
      :columns="columns"
      :data="getRoleList"
      :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
    >

        <span slot="action" slot-scope="text, record">
            <template>
              <span v-permission="'system.role.edit'">
                 <a @click="handleEdit(record)">
                <a-icon type="edit"/>编辑
              </a>
              <a-divider type="vertical"/>
              </span>
              <span v-permission="'system.role.delete'">
                <a @click="handleDelete(record)">
                <a-icon type="delete"/>删除
              </a>
              <a-divider type="vertical"/>
              </span>
              <span v-permission="'system.role.permission'">
                <a @click="showPermModal(record.id,record.name)">
                <a-icon type="user-add"/>角色权限
              </a>
              </span>

            </template>
        </span>
    </s-table>
    <role-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <role-permission-modal ref="rolePermissionModal" :menuTree="menuTree"/>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import RoleModal from './modules/RoleModal'
import RolePermissionModal from './modules/RolePermissionModal'
import {remove, getRoleList} from "@/api/system/role";
import {getMenuTree} from "@/api/system/menu";

export default {
  name: "Role",
  components: {
    STable,
    RoleModal,
    RolePermissionModal
  },
  data() {
    return {
      //查询参数
      queryParam: {},
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '角色编码',
          dataIndex: 'code'
        },
        {
          title: '显示顺序',
          dataIndex: 'orderNo'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '240px',
          align: 'center',
          scopedSlots: {customRender: 'action'}
        }
      ],
      ids: [],
      selectedRows: [],
      menuTree: []
    }
  },
  created() {
    getMenuTree().then(resp => {
      this.menuTree = resp.data
    })
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },
    showPermModal(id, name) {
      this.$refs.rolePermissionModal.show(id, name);
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleDelete(record) {
      const roleIds = record.id || this.ids
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + roleIds + '的数据',
        onOk() {
          return remove(roleIds)
            .then(resp => {
              if (resp.code === 200) {
                _this.$message.success('删除成功', 3)
                _this.refresh()
              } else {
                _this.$message.error(resp.msg)
              }

            })
        },
        onCancel() {
        }
      })
    },
    handleEdit(record) {
      this.$refs.modal.edit(record.id || this.ids[0])
    },
    handleSaveOk() {
      this.ids = []
      this.refresh()
    },
    handleSaveClose() {

    },
    getRoleList(parameter) {
      if (!parameter) {
        let page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }
      return getRoleList(Object.assign(parameter, this.queryParam)).then(resp => {
        return resp.data
      })
    },
    onSelectChange(ids, selectedRows) {
      this.ids = ids
      this.selectedRows = selectedRows
    }
  }
}


</script>

<style scoped>

</style>