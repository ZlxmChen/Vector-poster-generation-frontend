import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/editer',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    redirect: 'home',
    component: () => import('@/views/layout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home.vue'),
      }
    ]
  }
];

export default routes;
