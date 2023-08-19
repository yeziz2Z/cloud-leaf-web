<template>
  <a-modal
    :title="`${title}-权限列表`"
    :visible="visible"
    @cancel="close"
    @ok="submit"
  >

    <a-card>
      <a-input-search style="margin-bottom: 8px" placeholder="搜索"/>
      <a-tree
        :treeData="menuTree"
        :replaceFields="replaceFields"
        @check="check"
        ref="menu"
        v-model="menuCheckedKeys"
        checkable/>
    </a-card>
  </a-modal>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { selectMenusByRoleId, saveRoleMenus } from '@/api/system/role'

export default {
  name: 'RolePermissionModal',
  props: ['menuTree'],
  components: {
    ATree: Tree
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      replaceFields: {
        children: 'children',
        title: 'title',
        key: 'id'
      },
      title: '',
      roleId: null,
      menuCheckedKeys: [],
      menuHalfCheckedKeys: []
    }
  },
  beforeCreate () {

  },
  created () {

  },
  methods: {
    close () {
      this.visible = false
    },
    check (checkedKeys, e) {
      this.menuHalfCheckedKeys = e.halfCheckedKeys
      console.log(this.menuCheckedKeys, this.menuHalfCheckedKeys)
      console.log(this.menuTree)
    },
    show (id, name) {
      this.title = name
      this.roleId = id
      // TODO 固定模态框 添加滚动条
      selectMenusByRoleId(id).then(resp => {
        this.menuCheckedKeys = resp.data
        this.echoHalfCheckedKeys(this.menuTree)
        this.visible = true
      })
    },
    submit () {
      saveRoleMenus({ roleId: this.roleId, menuIds: this.menuCheckedKeys.concat(this.menuHalfCheckedKeys) })
        .then(resp => {
          if (resp.code === 200) {
            this.$message.success('赋权成功', 3)
            this.close()
          } else {
            this.$message.error(resp.msg, 3)
          }
        })
    },
    // 半选回显
    echoHalfCheckedKeys (nodes) {
      if (!nodes || nodes.length === 0) {
        return
      }
      nodes.forEach(node => {
        if (node.children) {
          const isExist = this.menuCheckedKeys.indexOf(node.id)
          if (isExist !== -1) {
            this.menuCheckedKeys.splice(isExist, 1)
          }
          this.echoHalfCheckedKeys(node.children)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
