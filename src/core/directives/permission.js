import Vue from 'vue'
import store from '@/store'

const permission = Vue.directive('permission', {
  inserted: function (el, binding, vnode) {
    const actionVal = binding.value
    const permissions = store.getters.permissions

    if (permissions && !permissions.includes(actionVal)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default permission
