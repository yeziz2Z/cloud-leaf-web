<template>
  <a-modal
    :title="`${title}-权限列表`"
    :visible="visible"
    @cancel="close"
    @ok="submit"
  >

    <a-card >
      <a-input-search style="margin-bottom: 8px" placeholder="搜索"/>
      <a-tree
        v-model="roleMenus"
        :treeData="menuTree"
        :replaceFields="replaceFields"
        checkable/>
    </a-card>
  </a-modal>
</template>

<script>
import {Tree} from 'ant-design-vue'
import {selectMenusByRoleId, saveRoleMenus} from "@/api/system/role";

export default {
  name: "RolePermissionModal",
  props: ['menuTree'],
  components: {
    ATree: Tree
  },
  data() {
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
      roleMenus: []
    }
  },
  beforeCreate() {

  },
  created() {

  },
  methods: {
    close() {
      this.visible = false
    },
    show(id, name) {
      this.title = name
      this.roleId = id
      //TODO 固定模态框 添加滚动条
      selectMenusByRoleId(id).then(resp => {
        this.roleMenus = resp.data
        this.visible = true
      })
    },
    submit() {
      saveRoleMenus({roleId: this.roleId, menuIds: this.roleMenus})
        .then(resp => {
          if (resp.code === 200){
            this.$message.success('赋权成功',3)
            this.close()
          }else {
            this.$message.error(resp.msg,3)
          }
        })

    },
    /*onChange(e) {
      /!*const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });*!/
    },*/
  }
}
</script>

<style scoped>

</style>