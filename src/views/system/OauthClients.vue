<template>
  <a-card :bordered="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="客户端ID">
                <a-input v-model="queryParam.clientId" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                  <span
class="table-page-search-submitButtons"
                        :style=" { float: 'right', overflow: 'hidden' } ">
                    <a-button
type="primary"
icon="search"
v-permission="'system.user.list'"
                              @click.stop="refresh">查询</a-button>
                    <a-button style="margin-left: 8px" icon="reload" @click="() => this.queryParam = {}">重置</a-button>

                  </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button icon="edit" :disabled="ids.length !== 1" @click="handleEdit">编辑
        </a-button>
        <a-button icon="eye" :disabled="ids.length !== 1" @click="handleView">查看</a-button>
        <a-button
type="danger"
:disabled="ids.length === 0"
icon="delete"
                  @click="handleDelete">删除
        </a-button>

      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="getClients"
        :alert="false"
        :pagination="{ showTotal: total => `共 ${total} 条` }"
        :showPagination="true"
        :rowKey="record => record.id"
        :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
      >

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
              <span>
                <a @click="handleEdit(record)">
                  <a-icon type="edit"/>编辑
                </a>
                <a-divider type="vertical"/>
              </span>
              <a @click="handleDelete(record)">
                <a-icon type="delete"/>删除
              </a>
            </template>
          </template>
      </s-table>
    </a-card>

    <oauth-client-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import OauthClientModal from './modules/OauthClientsModal'
import { page, remove, getClientById } from '@/api/system/oauthClients'

export default {
  name: 'OauthClients',
  components: {
    STable,
    // MTree,
    OauthClientModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户端id',
          dataIndex: 'clientId'
        },
        {
          title: '客户端密钥',
          dataIndex: 'clientSecret'
        },
        {
          title: '域',
          dataIndex: 'scope'
        },
        {
          title: '自动放行',
          dataIndex: 'autoApprove'
        },
        {
          title: '授权方式',
          dataIndex: 'authorizedGrantTypes'
        },
        {
          title: '认证令牌时效',
          dataIndex: 'accessTokenValidity'
        },
        {
          title: '刷新令牌时效',
          dataIndex: 'refreshTokenValidity'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      ids: [],
      selectedRows: [],
      colors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
    }
  },
  created () {

  },
  methods: {
    refresh () {
      this.$refs.table.refresh(true)
    },

    getClients (parameter) {
      if (!parameter) {
        const page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }
      return page(Object.assign(parameter, this.queryParam))
        .then(res => {
          return res.data
        }).catch(err => {
          this.$refs.table.localLoading = false
        })
    },
    confirmHandleStatus (row) {

    },
    cancelHandleStatus (row) {

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

    handleSaveOk () {
      this.ids = []
      this.refresh()
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

</style>
