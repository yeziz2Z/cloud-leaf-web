<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名称">
              <a-input v-model="queryParam.username" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="登录ip">
              <a-input v-model="queryParam.ipaddr" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="1">成功</a-select-option>
                <a-select-option value="0">失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item
              label="登陆时间">
              <a-range-picker
v-model="queryParam.loginTime"
                              style="width: 100%"
              />
            </a-form-item>
          </a-col>
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

      <a-button
type="danger"
:disabled="ids.length === 0"
icon="delete"
@click="handleDelete"
                v-permission="'system.loginLog.delete'">删除
      </a-button>
      <a-button type="danger" icon="delete" @click="removeAll">清空</a-button>

    </div>
    <s-table
      ref="table"
      size="default"
      :rowKey="record => record.id"
      :pagination="{ showTotal: total => `共 ${total} 条` }"
      :columns="columns"
      :data="getLoginLogs"
      :rowSelection="{ selectedRowKeys: ids, onChange: onSelectChange }"
    >
        <template #status="text">
          <a-tag :color="text==='1'?'green':'red'">{{ text === '1' ? '成功' : '失败' }}</a-tag>
        </template>

    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getLoginLogs, remove } from '@/api/system/loginLog'
import moment from 'moment'
import pick from 'lodash.pick'

export default {
  name: 'LoginLog',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '登录用户',
          dataIndex: 'userName'
        },
        {
          title: '登录IP',
          dataIndex: 'ipaddr'
        },
        {
          title: '登陆状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '登录信息',
          dataIndex: 'msg'
        },
        {
          title: '登录日期',
          dataIndex: 'accessTime'
        }

      ],
      ids: [],
      selectedRows: []
    }
  },
  created () {

  },
  methods: {
    moment,
    refresh () {
      this.$refs.table.refresh(true)
    },
    reset () {
      this.queryParam = {}
    },

    removeAll () {
      this.$message.success('清空完成', 3)
    },
    handleDelete (record) {
      const roleIds = record.id || this.ids
      const _this = this
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + roleIds + '的数据',
        onOk () {
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
        onCancel () {
        }
      })
    },
    getLoginLogs (parameter) {
      if (!parameter) {
        const page = this.$refs.table.localPagination
        parameter = {
          current: page.current,
          size: page.pageSize
        }
      }

      const param = this.queryParam
      if (param.loginTime && param.loginTime.length > 0) {
        param.startDate = moment(param.loginTime[0]).format('YYYY-MM-DD')
        param.endDate = moment(param.loginTime[1]).format('YYYY-MM-DD')
      }
      return getLoginLogs(Object.assign(parameter, pick(param, 'username', 'ipaddr', 'status', 'startDate', 'endDate'))).then(resp => {
        return resp.data
      })
    },
    onSelectChange (ids, selectedRows) {
      this.ids = ids
      this.selectedRows = selectedRows
    }
  }
}

</script>

<style scoped>

</style>
