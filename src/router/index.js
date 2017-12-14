import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Interview from '@/views/employee/Interview'
import Department from '@/views/system/Department'
import User from '@/views/system/User'
import Login from '@/views/Login'
import Role from '@/views/system/Role'
import Permissions from '@/views/system/Permissions'
import Module from '@/views/system/Module'
import RolePermissions from '@/views/system/RolePermissions'
import PermissionsModule from '@/views/system/PermissionsModule'

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
        },
        {
          path:'/system/role',
          name:'role',
          visible:true,
          component:Role,
          meta:{
            title:'角色管理'
          }
        },
        {
          path:'/system/permissions',
          name:'permissions',
          visible:true,
          component:Permissions,
          meta:{
            title:'权限管理'
          }
        },
        {
          path:'/system/module',
          name:'module',
          visible:true,
          component:Module,
          meta:{
            title:'模块管理'
          }
        },
        {
          path:'/system/role/permissions',
          name:'rolepermissions',
          visible:true,
          component:RolePermissions,
          meta:{
            title:'角色权限设置'
          }
        },
        {
          path:'/system/permissions/module',
          name:'permissionsmodule',
          visible:true,
          component:PermissionsModule,
          meta:{
            title:'权限模块设置'
          }
        }
      ]
    },
    {
      path:'/login',
      name:'Login',
      visible:false,
      component:Login
    }
  ]
})
