<template>
  <a-card :bordered="false">
    <a-row :gutter="8">

      <a-col :span="5">
        <a-card>
          <a-tree :tree-data="orgTree" @select="handleClick"/>
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
                    <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                    <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>

                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
            <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1">
                  <a-icon type="delete"/>
                  删除
                </a-menu-item>
                <!-- lock | unlock -->
                <a-menu-item key="2">
                  <a-icon type="lock"/>
                  锁定
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                批量操作
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
          </div>
          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="getUserList"
            :alert="false"
            :rowKey='record => record.id'
            :showPagination='true'
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >
            <!--          <span slot="action" slot-scope="text, record">
                        <template v-if="$auth('table.update')">
                          <a @click="handleEdit(record)">编辑</a>
                          <a-divider type="vertical" />
                        </template>
                        <a-dropdown>
                          <a class="ant-dropdown-link">
                            更多 <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a href="javascript:;">详情</a>
                            </a-menu-item>
                            <a-menu-item v-if="$auth('table.disable')">
                              <a href="javascript:;">禁用</a>
                            </a-menu-item>
                            <a-menu-item v-if="$auth('table.delete')">
                              <a href="javascript:;">删除</a>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </span>-->
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
                  <a href="javascript:;">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">禁用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
          </s-table>
        </a-card>
      </a-col>


    </a-row>

    <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
// import MTree from '@/components/Tree/Tree'
import {STable} from '@/components'
import OrgModal from './modules/OrgModal'
import {getOrgTree, getServiceList} from '@/api/manage'
import {Tree} from 'ant-design-vue'

export default {
  name: 'User',
  components: {
    STable,
    // MTree,

    OrgModal,
    ATree: Tree
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 高级搜索 展开/关闭
      advanced: false,
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
          title: '部门',
          dataIndex: 'organization.name',
        },
        {
          title: '状态',
          dataIndex: 'status',
          needTotal: true
        },
        {
          title: '手机号',
          dataIndex: 'mobilePhone',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      /*loadData: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },*/
      // loadData: this.getUserList(),
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    getOrgTree().then(res => {
      this.orgTree = res.data
    })
  },
  methods: {
    handleClick(key, e) {
      console.log('handleClick', key, e)
      this.queryParam.orgId = key.length ? key[0] : null

      let page = this.$refs.table.localPagination
      const parameter = {
        current: page.current,
        size: page.pageSize
      }
      this.getUserList(parameter)
      this.$refs.table.refresh(true)
    },
    getUserList(parameter) {
      return getServiceList(Object.assign(parameter, this.queryParam))
        .then(res => {
          return res.data
        })
    },
    handleEdit(record) {
      console.log(record);
    },
    handleAdd(item) {
      console.log('add button, item', item)
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
      this.$refs.modal.add(item.key)
    },
    handleTitleClick(item) {
      console.log('handleTitleClick', item)
    },
    titleClick(e) {
      console.log('titleClick', e)
    },
    handleSaveOk() {

    },
    handleSaveClose() {

    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
