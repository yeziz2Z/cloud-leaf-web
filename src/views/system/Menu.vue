<template>
  <a-card :bordered="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.title" placeholder=""/>
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
              <span
                class="table-page-search-submitButtons"
                :style=" { float: 'right', overflow: 'hidden' } ">
                <a-button type="primary" icon="search" @click="loadMenus">查询</a-button>
                <a-button style="margin-left: 8px" icon="reload" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" v-permission="'system.menu.add'" @click="handleAdd">新建</a-button>
        <!--        <a-button type="danger" :disabled="ids.length === 0" icon="delete" @click="handleDelete">删除</a-button>-->
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data-source="menus"
        :pagination="false"
        :row-key="record => record.id"

      >

        <template #icon="text,record">
          <a-icon v-if="text" :type="text"></a-icon>
        </template>
        <template #status="text, record">
          <a-tag :color="text?'green':'red'">{{ text ? '正常' : '停用' }}</a-tag>
        </template>
        <template #action="text, record">
          <template>
            <span v-permission="'system.menu.edit'">
              <a @click="handleEdit(record)">
                <a-icon type="edit"/>编辑
              </a>
              <a-divider type="vertical"/>
            </span>
            <span v-permission="'system.menu.add'">
              <a @click="handleAdd(record)">
                <a-icon type="plus"/>新增
              </a>
              <a-divider type="vertical"/>
            </span>
            <a v-permission="'system.menu.delete'" @click="handleDelete(record)">
              <a-icon type="delete"/>删除
            </a>
          </template>
        </template>
      </s-table>
    </a-card>

    <menu-modal :menus="menuTree" ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import MenuModal from './modules/MenuModal'
import { getMenuTree, remove } from '@/api/system/menu'
import { Tree, Table } from 'ant-design-vue'

export default {
  name: 'Menu',
  components: {
    STable: Table,
    // MTree,
    MenuModal,
    ATree: Tree
  },
  data () {
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
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '排序',
          dataIndex: 'orderNo'
        },
        {
          title: '权限标识',
          dataIndex: 'permission'
        },
        {
          title: '组件',
          dataIndex: 'component'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      menus: [],
      menuTree: [{ label: '菜单', id: 0 }],
      ids: [],
      selectedRows: [],
      colors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
    }
  },
  created () {
    this.loadMenus()
  },
  methods: {
    loadMenus () {
      getMenuTree(this.queryParam).then(resp => {
        this.menus = resp.data
        this.menuTree[0].children = this.menus
      })
    },
    handleAdd (item) {
      this.$refs.modal.add(item.id)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record.id || this.ids[0])
    },
    handleView (record) {
      this.$refs.modal.view(record.id || this.ids[0])
    },
    handleDelete (record) {
      const id = record.id
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + record.id + '的数据',
        onOk () {
          return remove(id)
            .then(resp => {
              if (resp.code === 200) {
                _this.$message.success('删除成功', 3)
                this.loadMenus()
              } else {
                _this.$message.error(resp.msg)
              }
            })
        },
        onCancel () {
        }
      })
    },

    handleSaveOk () {
      this.ids = []
      this.loadMenus()
    },
    handleSaveClose (e) {
    },
    onSelectChange (ids, selectedRows) {
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
