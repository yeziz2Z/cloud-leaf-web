<template>
  <a-card :bordered="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                  <span class="table-page-search-submitButtons"
                        :style=" { float: 'right', overflow: 'hidden' }  ">
                    <a-button type="primary" icon="search" @click="refresh">查询</a-button>
                    <a-button style="margin-left: 8px" icon="reload" @click="() => this.queryParam = {}">重置</a-button>
                  </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="danger" :disabled="ids.length === 0" icon="delete" @click="handleDelete">删除</a-button>

      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data-source="menus"
        :pagination="false"
        :row-key="record => record.id"
        :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
      >

            <span slot="icon" slot-scope="text,record">
              <a-icon :type="text"></a-icon>
            </span>
        <span slot="status" slot-scope="text, record">
              <a-tag color="green">{{text?'正常':'停用'}}</a-tag>
            </span>
        <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">
                <a-icon type="edit"/>编辑
              </a>
              <a-divider type="vertical"/>
              <a @click="handleAdd(record)">
                <a-icon type="plus"/>新增
              </a>
              <a-divider type="vertical"/>
              <a @click="handleDelete(record)">
                <a-icon type="delete"/>删除
              </a>
            </template>
          </span>
      </s-table>
    </a-card>

    <menu-modal :orgTree="orgTree" :roleOptions="roleOptions" ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import MenuModal from './modules/MenuModal'
import {getMenuTree} from '@/api/system/menu'
import {Tree, Table} from 'ant-design-vue'

export default {
  name: 'Menu',
  components: {
    STable: Table,
    // MTree,
    MenuModal,
    ATree: Tree
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'title'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          scopedSlots: {customRender: 'icon'}
        },
        {
          title: '排序',
          dataIndex: 'orderNo',
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
        },
        {
          title: '组件',
          dataIndex: 'component',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      orgTree: [],
      roleOptions: [],
      menus: [],
      ids: [],
      selectedRows: [],
      colors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
    }
  },
  created() {
    getMenuTree().then(resp => {
      this.menus = resp.data
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
        onOk() {
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
        onCancel() {
        }
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
