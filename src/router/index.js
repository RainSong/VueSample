import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Interview from '@/views/employee/Interview'
import Department from '@/views/system/Department'
import User from '@/views/system/User'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      visible: false,
      component: Home//() => import('@/views/Home')
    },
    {
      path: '/employee/interview',
      name: 'Employee',
      visible: true,
      meta: {
        title: '员工管理'
      },
      component: Home,
      children: [
        {
          path: '/employee/interview',
          name: 'Interview',
          component: Interview,//() => import('@/views/customer/Interview'),
          visible: true,
          meta: {
            title: '面试管理'
          }
        }
      ]
    },
    {
      path: '/system/department',
      name: 'System',
      visible: true,
      component: Home,
      meta: {
        title: '系统设置'
      },
      children: [
        {
          path: '/system/department',
          name: 'department',
          visible: true,
          component: Department,
          meta: {
            title: '部门管理'
          }
        },
        {
          path:'/system/user',
          name:'user',
          visible:true,
          component:User,
          meta:{
            title:'用户管理'
          }
        }
      ]
    }
  ]
})
