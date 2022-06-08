<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典名称">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="字典编码">
              <a-input v-model="queryParam.type" placeholder="请输入"/>
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
      <a-button type="primary" icon="plus" v-permission="'system.role.add'" @click="handleDictTypeAdd">新建</a-button>
      <a-button icon="edit" :disabled="ids.length !== 1" @click="handleDictTypeEdit" v-permission="'system.role.edit'">
        修改
      </a-button>
      <a-button type="danger" :disabled="ids.length === 0" icon="delete" @click="handleDictTypeDelete"
                v-permission="'system.role.delete'">删除
      </a-button>

    </div>
    <s-table
      ref="table"
      size="default"
      :rowKey='record => record.id'
      :pagination="{ showTotal: total => `共 ${total} 条` }"
      :columns="columns"
      @expand="getDictDataList"
      :data="getDictTypes"
      :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
    >
        <span slot="status" slot-scope="text, record">
          <a-tag :color="text=='1'?'green':'red'">{{ text == '1' ? '正常' : '停用' }}</a-tag>
        </span>
      <span slot="action" slot-scope="text, record">
            <template>
              <span v-permission="'system.role.edit'">
                 <a @click="handleDictTypeEdit(record)">
                <a-icon type="edit"/>编辑
              </a>
              <a-divider type="vertical"/>
              </span>
              <span v-permission="'system.role.delete'">
                <a @click="handleDictTypeDelete(record)">
                <a-icon type="delete"/>删除
              </a>
              <a-divider type="vertical"/>
              </span>
              <span v-permission="'system.role.permission'">
                <a @click="handleDictDataAdd(record.type)">
                <a-icon type="plus"/>添加字典枚举
              </a>
              </span>

            </template>
        </span>
      <a-table slot="expandedRowRender"
               slot-scope="record"
               :columns="dictDataColumns"
               :row-key="'id'"
               :loading="loading"
               :data-source="record.childData"
               :pagination="false"
      >
        <span slot="status" slot-scope="text, record">
          <a-tag :color="text=='1'?'green':'red'">{{ text == '1' ? '正常' : '停用' }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
            <template>
              <span v-permission="'system.role.edit'">
                 <a @click="handleDictDataEdit(record.id)">
                <a-icon type="edit"/>编辑
              </a>
              <a-divider type="vertical"/>
              </span>
              <span v-permission="'system.role.delete'">
                <a @click="handleDictDataDelete(record)">
                <a-icon type="delete"/>删除
              </a>
              </span>
            </template>
        </span>
      </a-table>

    </s-table>

    <dict-type-modal ref="dictTypeModal" @ok="handleSaveDictTypeOk" @close="handleSaveDictTypeClose"/>
    <dict-data-modal ref="dictDataModal" @ok="handleSaveDictDataOk"/>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import {Table} from 'ant-design-vue'
import DictTypeModal from './modules/DictTypeModal'
import DictDataModal from './modules/DictDataModal'
import {page, dictDataList, removeDictType, removeDictData} from "@/api/system/dict";

export default {
  name: "Dict",
  components: {
    STable,
    DictTypeModal,
    DictDataModal,
    ATable: Table
  },
  data() {
    return {
      //查询参数
      queryParam: {},
      columns: [
        {
          title: '字典名称',
          dataIndex: 'name'
        },
        {
          title: '字典类型',
          dataIndex: 'type'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '280px',
          align: 'center',
          scopedSlots: {customRender: 'action'}
        }
      ],
      dictDataColumns: [
        {
          title: '字典标签',
          dataIndex: 'label'
        },
        {
          title: '字典值',
          dataIndex: 'value'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '280px',
          align: 'center',
          scopedSlots: {customRender: 'action'}
        }
      ],
      loading: false,
      ids: [],
      selectedRows: [],
      menuTree: []
    }
  },
  created() {

  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },

    handleDictTypeDelete(record) {
      const dictTypeIds = record.id || this.ids
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + dictTypeIds + '的数据',
        onOk() {
          return removeDictType(dictTypeIds)
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
    handleDictTypeAdd() {
      this.$refs.dictTypeModal.add()
    },
    handleDictTypeEdit(record) {
      this.$refs.dictTypeModal.edit(record.id || this.ids[0])
    },
    handleSaveDictTypeOk() {
      this.ids = []
      this.refresh()
    },
    handleSaveDictTypeClose() {

    },
    handleDictDataAdd(type) {
      this.$refs.dictDataModal.add(type)
    },
    handleDictDataEdit(id) {
      this.$refs.dictDataModal.edit(id)
    },
    handleSaveDictDataOk(type) {
      this.ids = []
      this.getDictDataList(true,this.getCurrentDictTypeRow(type))
    },
    handleDictDataDelete(record) {
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中字典标签为 [' + record.label + '] 的数据',
        onOk() {
          return removeDictData(record.id)
            .then(resp => {
              if (resp.code === 200) {
                _this.$message.success('删除成功', 3)
                _this.getDictDataList(true,_this.getCurrentDictTypeRow(record.type))
              } else {
                _this.$message.error(resp.msg)
              }
            })
        },
        onCancel() {
        }
      })
    },
    handleSaveDictDataClose() {

    },
    getCurrentDictTypeRow(type) {
      return this.$refs.table.localDataSource.find(data => type === data.type)
    },
    getDictTypes(parameter) {
      if (!parameter) {
        let page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }
      return page(Object.assign(parameter, this.queryParam)).then(resp => {
        return resp.data
      })
    },
    getDictDataList(open, record) {
      if (!open) {
        return
      }
      this.loading = true
      dictDataList(record.type).then(resp => {
        record.childData = resp.data
      }).catch(err => {
        record.childData = []
      }).finally(() => {
          this.loading = false
        }
      )
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